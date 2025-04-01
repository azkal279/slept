#!/usr/bin/env node

/**
 * Git COMMIT-MSG hook for validating commit message
 * See https://docs.google.com/document/d/1rk04jEuGfk9kYzfqCuOlPTSJw3hEDZJTBN5E5f1SALo/edit
 *
 * Installation:
 * >> use ghooks, config in package.json
 */

'use strict'

let fs = require('fs')
let util = require('util')
let resolve = require('path').resolve
let findup = require('findup')
let semverRegex = require('semver-regex')

let config = getConfig()
let MAX_LENGTH = config.maxSubjectLength || 100
let IGNORED = new RegExp(
  util.format('(^WIP)|(^v)|(^%s$)', semverRegex().source)
)
/* eslint-disable no-useless-escape */
// fixup! and squash! are part of Git, commits tagged with them are not intended to be merged, cf. https://git-scm.com/docs/git-commit
let PATTERN = /^((fixup! |squash! )?(\w+)(?:\(([^\)\s]+)\))?: (.+))(?:\n|$)/
let MERGE_COMMIT_PATTERN = /^Merge /
let error = function() {
  // gitx does not display it
  // http://gitx.lighthouseapp.com/projects/17830/tickets/294-feature-display-hook-error-message-when-hook-fails
  // https://groups.google.com/group/gitx/browse_thread/thread/a03bcab60844b812
  console[config.warnOnFail ? 'warn' : 'error'](
    'Invalid commit message: ' + util.format.apply(null, arguments)
  )
  console.log(
    'See our specific at:',
    'https://github.com/alibaba/uform/blob/master/.github/GIT_COMMIT_SPECIFIC.md'
  )
}

let validateMessage = function(raw) {
  let types = (config.types = config.types || 'conventional-commit-types')

  // resolve types from a module
  if (typeof types === 'string' && types !== '*') {
    types = Object.keys(require(types).types)
  }

  let messageWithBody = (raw || '')
    .split('\n')
    .filter(function(str) {
      return str.indexOf('#') !== 0
    })
    .join('\n')

  let message = messageWithBody.split('\n').shift()

  if (message === '') {
    console.log('Aborting commit due to empty commit message.')
    return false
  }

  let isValid = true

  if (MERGE_COMMIT_PATTERN.test(message)) {
    console.log('Merge commit detected.')
    return true
  }

  if (IGNORED.test(message)) {
    console.log('Commit message validation ignored.')
    return true
  }

  let match = PATTERN.exec(message)

  if (!match) {
    error('does not match "<type>(<scope>): <subject>" !')
    isValid = false
  } else {
    let firstLine = match[1]
    let squashing = !!match[2]
    let type = match[3]
    // let scope = match[4]
    let subject = match[5]

    let SUBJECT_PATTERN = new RegExp(config.subjectPattern || '.+')
    let SUBJECT_PATTERN_ERROR_MSG =
      config.subjectPatternErrorMsg || 'subject does not match subject pattern!'

    if (firstLine.length > MAX_LENGTH && !squashing) {
      error('is longer than %d characters !', MAX_LENGTH)
      isValid = false
    }

    if (types !== '*' && types.indexOf(type) === -1) {
      error(
        '"%s" is not allowed type ! Valid types are: %s',
        type,
        types.join(', ')
      )
      isValid = false
    }

    if (!SUBJECT_PATTERN.exec(subject)) {
      error(SUBJECT_PATTERN_ERROR_MSG)
      isValid = false
    }
  }

  // Some more ideas, do want anything like this ?
  // - Validate the rest of the message (body, footer, BREAKING CHANGE annotations)
  // - allow only specific scopes (eg. fix(docs) should not be allowed ?
  // - auto correct the type to lower case ?
  // - auto correct first letter of the subject to lower case ?
  // - auto add empty line after subject ?
  // - auto remove empty () ?
  // - auto correct typos in type ?
  // - store incorrect messages, so that we can learn

  isValid = isValid || config.warnOnFail

  if (isValid) {
    // exit early and skip messaging logics
    return true
  }

  let argInHelp = config.helpMessage && config.helpMessage.indexOf('%s') !== -1

  if (argInHelp) {
    console.log(config.helpMessage, messageWithBody)
  } else if (message) {
    console.log(message)
  }

  if (!argInHelp && config.helpMessage) {
    console.log(config.helpMessage)
  }

  return false
}

// publish for testing
exports.validateMessage = validateMessage
exports.getGitFolder = getGitFolder
exports.config = config

// hacky start if not run by mocha :-D
// istanbul ignore next
if (process.argv.join('').indexOf('mocha') === -1) {
  let commitMsgFile = process.argv[2] || getGitFolder() + '/COMMIT_EDITMSG'
  let incorrectLogFile = commitMsgFile.replace(
    'COMMIT_EDITMSG',
    'logs/incorrect-commit-msgs'
  )

  let hasToString = function hasToString(x) {
    return x && typeof x.toString === 'function'
  }
  /* eslint-disable handle-callback-err */
  fs.readFile(commitMsgFile, function(err, buffer) {
    let msg = getCommitMessage(buffer)

    if (!validateMessage(msg)) {
      fs.appendFile(incorrectLogFile, msg + '\n', function() {
        process.exit(1)
      })
    } else {
      process.exit(0)
    }

    function getCommitMessage(buffer) {
      return hasToString(buffer) && buffer.toString()
    }
  })
}

function getConfig() {
  let pkgFile = findup.sync(process.cwd(), 'package.json')
  let pkg = JSON.parse(fs.readFileSync(resolve(pkgFile, 'package.json')))
  return (pkg && pkg.config && pkg.config['validate-commit-msg']) || {}
}

function getGitFolder() {
  let gitDirLocation = './.git'
  if (!fs.existsSync(gitDirLocation)) {
    throw new Error('Cannot find file ' + gitDirLocation)
  }

  if (!fs.lstatSync(gitDirLocation).isDirectory()) {
    let unparsedText = '' + fs.readFileSync(gitDirLocation)
    gitDirLocation = unparsedText.substring('gitdir: '.length).trim()
  }

  if (!fs.existsSync(gitDirLocation)) {
    throw new Error('Cannot find file ' + gitDirLocation)
  }

  return gitDirLocation
}

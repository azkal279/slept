import ts from 'typescript'

function exit(exitCode: number) {
  if (exitCode === 0) return
  console.log(`Process exiting with code '${exitCode}'.`)
  process.exit(exitCode)
}

function diagnositcReporter(diagnostic: ts.Diagnostic) {
  let msg = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  if (diagnostic.file) {
    var { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    msg = `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${msg}`;
  }
  console.error(msg);
}

export function getCompileConfig(configPath: string, extendOptions?: ts.CompilerOptions) {
  var host: ts.ParseConfigFileHost = ts.sys as any
  host.onUnRecoverableConfigFileDiagnostic = diagnositcReporter
  var parsedCmd = ts.getParsedCommandLineOfConfigFile(configPath, extendOptions, host);
  host.onUnRecoverableConfigFileDiagnostic = undefined
  if (parsedCmd.errors.length) {
    console.error(parsedCmd.errors.join('\n'))
    exit(1)
  }
  return { options: parsedCmd.options, fileNames: parsedCmd.fileNames }
}


export function compile(rootNames: string[], options: ts.CompilerOptions, customTransformers?: ts.CustomTransformers) {
  var program = ts.createProgram({ rootNames, options })
  var emitResult = program.emit(
    undefined,
    undefined,
    undefined,
    undefined,
    customTransformers
  )
  ts.getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)
    .forEach(diagnositcReporter);

  var exitCode = emitResult.emitSkipped ? 1 : 0;
  exit(exitCode)
}

export function build(configPath: string, customTransformers?: ts.CustomTransformers) {
  var { options, fileNames } = getCompileConfig(configPath)
  compile(fileNames, options, customTransformers)
}
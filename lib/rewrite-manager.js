var path = require('path')
var AbstractFileManager = require('less/lib/less-node/file-manager')

module.exports = function() {
  function RewriteManager(options) {
    this.options = options || {}

    if (this.options.paths === undefined) {
      this.options.paths = {}
    }
  }

  RewriteManager.prototype = new AbstractFileManager()

  RewriteManager.prototype.supports = function(filename, currentDirectory, options, environment) {
    return filename in this.options.paths
  }

  RewriteManager.prototype.supportsSync = RewriteManager.prototype.supports

  RewriteManager.prototype.loadFile = function(filename, currentDirectory, options, environment, callback) {
    return AbstractFileManager.prototype.loadFile.call(
      this,
      this.resolve(filename, currentDirectory),
      '',
      options,
      environment
    )
  }

  RewriteManager.prototype.loadFileSync = function(filename, currentDirectory, options, environment) {
    return AbstractFileManager.prototype.loadFileSync.call(
      this,
      this.resolve(filename, currentDirectory),
      '',
      options,
      environment
    )
  }

  RewriteManager.prototype.resolve = function(filename, currentDirectory) {
    var originFilename = filename,
      extension = ''

    if (this.options.paths[filename] === undefined) {
      extension = path.extname(filename)
      filename = filename.substring(0, filename.length - extension.length)
    }

    if (this.options.paths[filename] === undefined) {
      return originFilename
    }

    var newFilename = this.options.paths[filename]
    if (newFilename instanceof Function) {
      newFilename = newFilename(originFilename, currentDirectory)
    } else {
      newFilename += extension
    }

    return newFilename
  }

  return RewriteManager
}

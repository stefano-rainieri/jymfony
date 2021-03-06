const SelfCheckingResourceInterface = Jymfony.Component.Config.Resource.SelfCheckingResourceInterface;
const fs = require('fs');

/**
 * @memberOf Jymfony.Component.Config.Resource
 */
class FileResource extends implementationOf(SelfCheckingResourceInterface) {
    __construct(resource) {
        this._resource = fs.realpathSync(resource);
    }

    /**
     * {@inheritDoc}
     */
    toString() {
        return this._resource;
    }

    /**
     * {@inheritDoc}
     */
    isFresh(timestamp) {
        return fs.existsSync(this._resource) && fs.statSync(this._resource).mtime <= timestamp;
    }
}

module.exports = FileResource;

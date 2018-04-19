const DateTime = Jymfony.Component.DateTime.DateTime;
const FormatterInterface = Jymfony.Component.Logger.Formatter.FormatterInterface;

/**
 * @memberOf Jymfony.Component.Logger.Formatter
 */
class MongoDBFormatter extends implementationOf(FormatterInterface) {
    /**
     * Constructor.
     *
     * @param {number} [maxNestingLevel = 3]    means infinite nesting, the record itself is level 1,
     *                                          record.context is 2
     * @param {boolean} exceptionTraceAsString  set to false to log exception traces as a sub documents
     *                                          instead of strings
     */
    __construct(maxNestingLevel = 3, exceptionTraceAsString = true) {
        this._maxNestingLevel = Math.max(maxNestingLevel, 0);
        this._exceptionTraceAsString = exceptionTraceAsString;

        this._isLegacyMongoExt = undefined; // [DOUBT] is it needed for node?
    }

    /**
     * @inheritDoc
     */
    format(record) {
        return this._formatArray(record);
    }

    /**
     * @inheritDoc
     */
    formatBatch(records) {
        records = __jymfony.deepClone(records);
        for (const [ key, record ] of __jymfony.getEntries(records)) {
            records[key] = this.format(record);
        }

        return records;
    }

    /**
     *
     * @param {*} record
     * @param {number} nestingLevel
     *
     * @return {[]|string} Array except when max nesting level is reached then a string "[...]"
     *
     * @protected
     */
    _formatArray(record, nestingLevel = 0) {
        if (0 === this._maxNestingLevel || nestingLevel <= this._maxNestingLevel) {
            record = __jymfony.deepClone(record);
            for (const [ name, value ] of __jymfony.getEntries(record)) {
                if (value instanceof Date) {
                    record[name] = this._formatDate(new DateTime(value), nestingLevel + 1);
                } else if (value instanceof DateTime) {
                    record[name] = this._formatDate(value, nestingLevel + 1);
                } else if (value instanceof Error) {
                    record[name] = this._formatError(value, nestingLevel + 1);
                } else if (isArray(value)) {
                    record[name] = this._formatArray(value, nestingLevel + 1);
                } else if (isObject(value)) {
                    record[name] = this._formatObject(value, nestingLevel + 1);
                }
            }
        } else {
            record = '[...]';
        }

        return record;
    }

    /**
     * @param {*} value
     * @param {number} nestingLevel
     *
     * @protected
     */
    _formatObject(value, nestingLevel) {
        const objectVars = {}; // [DOUBT] how to get object var in js?
        objectVars.class = value.constructor.name; // [DOUBT] I don't know if it's the right thing to get class name

        return this._formatArray(objectVars, nestingLevel);
    }

    /**
     * @param {Error} record
     * @param {number} nestingLevel
     *
     * @protected
     */
    _formatError(record, nestingLevel) {
        const trace = Exception.parseStackTrace(record);
        const reflClass = new ReflectionClass(trace);

        const formatted = {
            'class': reflClass.name,
            message: record.message,
            trace: this._exceptionTraceAsString ? record.stack : trace,
        };

        return this._formatArray(formatted, nestingLevel);
    }

    /**
     * @param {DateTime} value
     * @param {number} nestingLevel
     *
     * @protected
     */
    _formatDate(value, nestingLevel) {
        if (this._isLegacyMongoExt) {
            return this._legacyGetMongoBdDateTime(value);
        }

        return this._getMongoDbDateTime(value);
    }

    /**
     * @param {*} value
     *
     * @private
     */
    _getMongoDbDateTime(value) {
        // todo : implementing mongodb UTCDateTime or is there in the driver package?
    }

    /**
     * @param {DateTime} value
     *
     * @private
     */
    _legacyGetMongoBdDateTime(value) {
        // todo : implementing mongodb UTCDateTime or is there in the driver package?
    }
}

module.exports = MongoDBFormatter;

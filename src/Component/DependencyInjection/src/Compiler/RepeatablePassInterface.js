const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * A pass that might be run repeatedly
 *
 * @memberOf Jymfony.DependencyInjection.Compiler
 */
class RepeatablePassInterface extends CompilerPassInterface.definition {
    /**
     * Sets the RepeatedPass interface
     *
     * @function
     * @name RepeatablePassInterface#setRepeatedPass
     *
     * @param {Jymfony.DependencyInjection.Compiler.RepeatedPass} container
     */
}

module.exports = getInterface(RepeatablePassInterface);

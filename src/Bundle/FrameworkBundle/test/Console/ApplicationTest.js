const expect = require('chai').expect;
const path = require('path');

const Application = Jymfony.Bundle.FrameworkBundle.Console.Application;
const Namespace = Jymfony.Component.Autoloader.Namespace;
const Kernel = Jymfony.Component.Kernel.Kernel;

Jymfony.Bundle.FrameworkBundle.Tests = new Namespace(__jymfony.autoload, 'Jymfony.Bundle.FrameworkBundle.Tests');
Jymfony.Bundle.FrameworkBundle.Tests.Fixtures = new Namespace(
    __jymfony.autoload,
    'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures',
    [ path.join(__dirname, '..', '..', 'fixtures') ]
);

const TestKernel = Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.TestKernel;

describe('[FrameworkBundle] Application', function () {
    this.timeout(Infinity);

    it('constructor', () => {
        const kernel = new TestKernel('test', true, false);
        const application = new Application(kernel);

        expect(application.kernel).to.be.equal(kernel);
    });

    it('find', async () => {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const command = application.find('my:command:foo');

        expect(kernel.container.get('command_1')).to.be.equal(command);
    });

    it('get', async () => {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const command = application.get('my:command:bar');

        expect(kernel.container.get('command_2')).to.be.equal(command);
    });

    it('all', async () => {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');

        const commands = application.all('my:command');

        expect(kernel.container.get('command_1')).to.be.equal(commands['my:command:foo']);
        expect(kernel.container.get('command_2')).to.be.equal(commands['my:command:bar']);
    });

    it('getLongVersion', async () => {
        const kernel = new TestKernel('test', true, true);
        await kernel.boot();
        const application = kernel.container.get('console.application');
        const expected = `Jymfony <info>${Kernel.VERSION}</info> (kernel: <comment>fixtures</comment>, env: <comment>test</comment>, debug: <comment>true</comment>)`;

        expect(application.getLongVersion()).to.be.equal(expected);
    });
});

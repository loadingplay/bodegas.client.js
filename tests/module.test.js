/*jshint esversion: 6 */

/**
 * basic modules tests, every module should inherit from those
 * @type {[type]}
 */
QUnit.module('Module',
    {
        beforeEach: function()
        {
            // nothing here..
        },
        afterEach : function()
        {
            // nothing here..
        }
    });


/**
 * test if onInit implementation is right
 */
QUnit.test('LyfeCycle', function(assert)
{
    var done = assert.async();
    var $target = $('<div></div>');

    class MyModule extends Module {
        onInit()
        {
            this.model = new Model(this.model_provider);
            this.addModel('test', this.model);

            // perform a get
            this.model.get('test_model', { 'test': 'foo' });

            // test_model
            this.view = new View($target, this.view_data_provider);
            this.view.setTemplate('{{ message }}');
            this.addView('test', this.view);
        }

        onModelLoaded(endpoint, data)
        {
            this.model.data = data;
            this.view.render();
            assert.equal($target.html(), 'foo');
            done();
        }

        onViewRequestData(view_name, view)
        {
            return this.model.data;
        }
    }

    var m = new MyModule();
    // // start some async tests
    // var done = assert.async();
    // var done2 = assert.async();
    //
    // class MyModule extends Module
    // {
    //     // implement abstract methods
    //     onInit()
    //     {
    //         var m = new Model('test');
    //         this.addModel('foo', m);
    //
    //         return true;
    //     }
    //
    //     // this method will be called each time a model is loaded
    //     onModelLoaded(name, model)
    //     {
    //         if (name === "foo")
    //         {
    //             assert.equal('foo', name, 'model loaded');
    //             this.addModel('bar', new Model('test2'));
    //             this.processModels();  // will only process new models
    //
    //             // render should be done here
    //
    //             done();
    //         }
    //         else
    //         {
    //             assert.equal('bar', name, 'model loaded');
    //             done2();
    //
    //             // render should be done here
    //         }
    //     }
    // }
    //
    // new MyModule();

});

/**
 * test Model
 * @param  {[type]} assert [description]
 * @return {[type]}        [description]
 */
QUnit.test('Model', function(assert)
{
    var done = assert.async();
    // basic model testing
    var mp = new ModelProvider();
    mp.onAjaxRespond = function(endpoint, data)
    {
        assert.equal(data[0].message, 'foo');
        done();
    };

    var m = new Model(mp);
    m.get('test_model', {});
});

QUnit.test('View', function(assert)
{
    // basic testing
    var done = assert.async();

    // create a view data provider
    // is where view get the data from...
    var vdp = new ViewDataProvider();
    vdp.getData = function()
    {
        return { 'test': 'foo' };
    };

    // create an html target
    var $target = $('<div></div>');
    $('body').append($target);

    // create a new view and render
    var v = new View($target, vdp);
    v.setTemplate('<div>{{ test }}</div>');
    v.render();

    // html should be populate with data
    assert.equal($target.html(), '<div>foo</div>');

    // now test with a list from data provider
    vdp.getData = function()
    {
        return [{ 'test': 'foo' }, { 'test': 'bar' }];
    };

    v.render();
    assert.equal($target.html(), '<div>foo</div><div>bar</div>');

    // views should be able to register and perform actions
    vdp.performAction = function(action, data, $element)
    {
        assert.equal(action, 'lp-click-test');
        assert.equal(data, 'foo');
        done();
    };

    // init view
    v.setClickAction('lp-click-test');
    v.setTemplate('<div lp-click-test="{{ test }}" ></div>');
    v.render();

    // perform click
    $('[lp-click-test]', $target)[0].click();

});

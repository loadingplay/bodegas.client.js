/*jshint esversion: 6 */

/**
 * Interface for model actions
 */
class ModelProvider {

    constructor()
    {
        // nothing here...
    }

    /**
     * this method is called once an ajax request is performed
     * @param  {object} data json data with request info
     */
    onAjaxRespond(endpoint, data)
    {
        // nothing here...
    }

    onModelUpdate(model)
    {
        // nothing here...
    }

    static Empty()
    {
        return new ModelProvider();
    }
}

class LPObject
{
    constructor()
    {
        this.id = Utils.createUUID();
    }
}


/**
 * connect to API and retrieve some data
 */
class Model extends LPObject
{
    /**
     * default constructor
     * @param  {ModelProvider} model_provider model provider interface
     */
    constructor(model_provider=ModelProvider.Empty())
    {
        super();
        this.setModelProvider(model_provider);
    }

    /**
     * change current model_provider
     * @param {ModelProvider} model_provider model provider interface
     */
    setModelProvider(model_provider)
    {
        if (model_provider instanceof ModelProvider)
        {
            this.model_provider = model_provider;
        }
        else
        {
            console.error("model provider should be ModelProvider instance");
        }
    }

    /**
     * load data from API
     * @param  {strign} endpoint   the actual API endpoint
     * @param  {object} parameters JSON object with data to send throw post
     * @return {Promise} async callback when is already loaded
     */
    get(endpoint, parameters)
    {
        let p = new Promise((resolve, reject) => {
            jQuery.get(Utils.getURLWithoutParam(endpoint), parameters)
                .done((data) => {
                    resolve(data);
                })
                .fail(() => {
                    reject();
                });
        });
        Promise.all([p]).then((data) => {
            this.onAjaxRespond(endpoint, data);
        });

        return p;
    }

    onAjaxRespond(endpoint, data)
    {
        this.model_provider.onAjaxRespond(endpoint, data);
    }

    modelUpdate()
    {
        this.model_provider.onModelUpdate(this);
    }

    /**
     *  post data to API
     * @param  {strign} endpoint   the actual API endpoint
     * @param  {object} parameters JSON object with data to send throw post
     * @return {Promise}           JS Promise for async Ajax
     */
    post(endpoint, parameters)
    {
        let p = new Promise((resolve, reject) => {
            jQuery.post(Utils.getURLWithoutParam(endpoint), parameters)
            .done((data) => {
                resolve(data);
                this.model_provider.onAjaxRespond(endpoint, data);
            })
            .fail(() => {
                reject();
            });
        });
        return p;
    }

}

/**
 * Interface for views
 */
class ViewDataProvider
{
    constructor()
    {
        // nothing here...
    }

    /**
     * this method is executed every time data is required
     */
    getData(view)
    {
        console.warn("you must implement this method");
    }

    /**
     * this method is called when user perform some action
     * @param  {string} tag_name action identifier
     * @param  {string} data     data contained in HTML tag [tag_name]
     * @param  {jQuery} $element jquery element from the event
     */
    performAction(tag_name, data, $element)
    {
        console.warn("you must implement this method");
    }

    static Empty()
    {
        return new ViewDataProvider();
    }
}

/**
 * grab a template and render with some data
 */
class View extends LPObject
{
    /**
     * default constructor
     * @param  {jQuery} $target             jquery object with targeted div
     * @param  {ViewDataProvider} view_data_provider
     *                                      where views get the data from
     */
    constructor($target, view_data_provider=ViewDataProvider.Empty())
    {
        super();
        this.$target = $target;
        this.template = '';
        this.click_actions = [];
        this.append = false;  // render method
        this.setDataProvider(view_data_provider);
    }

    /**
     * perform drawing operations in $target
     */
    render()
    {
        var html_builder = [];
        var data = this.view_data_provider.getData(this);

        // both are common cases
        if ($.isArray(data))
        {
            for (var i = 0; i < data.length; i++)
            {
                html_builder.push(Utils.render(this.template, data[i]));
            }
        }
        else
        {
            html_builder.push(Utils.render(this.template, data));
        }

        if (this.append)
        {
            this.$target.append(html_builder.join(''));
        }
        else
        {
            this.$target.html(html_builder.join(''));
        }
    }

    setClickAction(action_tag)
    {
        $(document).on('click', '[' + action_tag + ']', (e) =>
        {
            e.preventDefault();
            var $el = $(e.currentTarget);
            var data = $el.attr(action_tag);
            this.view_data_provider.performAction(action_tag, data, $el);
        });
    }

    /**
     * change current template
     * @param {string} template html template
     */
    setTemplate(template)
    {
        this.template = template;
    }

    /**
     * change data provider
     * @param {ViewDataProvider} view_data_provider
     *                                 where views get the data from
     */
    setDataProvider(view_data_provider)
    {
        if (view_data_provider instanceof ViewDataProvider)
        {
            this.view_data_provider = view_data_provider;
        }
        else
        {
            console.error("error setting view_data_provider");
        }
    }
}

/**
 * checkout module class definition
 * define life cycle of a module
 * LifeCycle
 * onInit() -> onModelLoaded(model) -> (optional) onViewRendered -> onDestroy
 */
class Module
{
    /**
     * init some properties
     * @return {[type]} [description]
     */
    constructor()
    {
        this.views = {};  // load all views here
        this.models = {};  // load all models here

        // add model and view providers
        this.model_provider = new ModelProvider();
        this.view_data_provider = new ViewDataProvider();

        this.model_provider.onAjaxRespond = (endpoint, data) =>
        {
            this.onModelLoaded(endpoint, data);
        };
        this.model_provider.onModelUpdate = (model) =>
        {
            this.onModelUpdate(model)
        };
        this.view_data_provider.getData = (view) =>
        {
            return this.onViewRequestData(view);
        };
        this.view_data_provider.performAction = (tag_name, data, $element) =>
        {
            this.onActionPerformed(tag_name, data, $element);
        };

        this.init();
    }

    /**
     * initialize module
     */
    init(imodule)
    {
        if (!this.onInit())
        {
            return;
        }
    }

    /**
     * add a new model saved on key
     * @param {string} key   key to access model later
     * @param {Model} model  model object to be loaded
     */
    addModel(key, model)
    {
        if (model instanceof Model)
        {
            model.setModelProvider(this.model_provider);
            this.models[key] = model;
        }
    }

    addView(key, view)
    {
        if (view instanceof View)
        {
            view.setDataProvider(this.view_data_provider);
            this.views[key] = view;
        }
    }

    /** LYFECYCLE **/

    /**
     * method called before initialization
     * add models and views here
     * @return {boolean}    true if must continue lifecycle
     */
    onInit()
    {
        console.warn("method must be imeplemented");
    }

    /**
     * render start rendering here
     * @param {string} key   key to access model later
     * @param {Model} model  model object to be loaded
     */
    onModelLoaded(endpoint, data)
    {
        console.warn("method must be imeplemented");
    }

    onModelUpdate(model)
    {
        console.warn("method must be implemented");
    }

    onViewRequestData(view)
    {
        console.warn("method must be implemented");
    }

    onActionPerformed(tag_name, data, $element)
    {
        console.warn("method must be imeplemented");
    }

}

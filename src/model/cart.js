/*jshint esversion: 6 */


class CartProduct {

    get total() { return this.quantity * this.price; }
    get upp_total() { return this.quantity * this.upp; }
    get imges() { return Array.isArray(this.images) ? this.images: []; }

    constructor(
        sku, combination="", price=0, name="", upp=1, bullet1="",
        bullet2="", bullet3="", im="", weight=0
    )
    {
        this.id = Utils.createUUID();
        this.sku = sku;
        this.combination = combination;
        this.price = price;
        this.name = name;
        this.quantity = 0;
        this.upp = upp;
        this.bullet_1 = bullet1;
        this.bullet_2 = bullet2;
        this.bullet_3 = bullet3;
        this.images = im;
        this.weight = weight;
    }

    static FromArray(a)
    {
        var cp = new CartProduct();
        cp.id = a.id;
        cp.sku = a.sku;
        cp.combination = a.combination;
        cp.price = a.price;
        cp.name = a.name;
        cp.quantity = a.quantity;
        cp.upp = a.upp;
        cp.bullet_1 = a.bullet_1;
        cp.bullet_2 = a.bullet_2;
        cp.bullet_3 = a.bullet_3;
        cp.images = a.images;
        cp.weight = a.weight;

        return cp;
    }
}


class CartProductListModel extends Model
{
    constructor(extra_info)
    {
        super();
        this.extra_info = extra_info;
        this.guid = this.generateGUID();
        this.products = [];
        this.percentage = 0;
        this.discount_code = "";
    }

    loadProducts()
    {
        this.get('v1/cart/' + this.guid).then((cart_products) =>
        {
            if (cart_products.cart.expired)
            {
                $.removeCookie('shopping-cart');
                this.guid = this.generateGUID();
                // onload([]);
            }
            this.createFromArray(cart_products.cart.items);
            // self.view.render();

            // onload(cart_products);
        });
    }

    createFromArray(l)
    {
        for (var i = 0; i < l.length; i++)
        {
            this.products.push(CartProduct.FromArray(l[i]));
        }
    }

    /**
     * check if product exists
     * @param  {string} id  product id
     * @return {boolean}    true if product exists, false otherwise
     */
    productExist(id)
    {
        return this.findProductIndex(id) !== -1;
    }

    findProductIndex(id)
    {
        // get the product from model, if exist or create from database
        for (var i = 0; i < this.products.length; i++)
        {
            if (this.products[i].id === id)
            {
                return i;
            }
        }
        return -1;
    }

    /**
     * get a GUID from cookies or generate and return
     * @return {string} GUID
     */
    generateGUID()
    {
        var old_guid = $.cookie('shopping-cart');
        var guid = old_guid;

        if (old_guid === undefined || old_guid === '')
        {
            guid = Utils.createUUID();  // request a new guid
            $.cookie('shopping-cart', guid);  // save to cookie
        }

        this.extra_info.cart_id = guid;
        return guid;
    }


    /**
     * add an element to the shopping cart
     * @param  {int}      id       product unique identifier
     * @param  {float}    price    product price
     * @param  {string}   name
     * @param  {int}      upp      units per product
     * @param  {string}   bullet1  some random text
     * @param  {string}   bullet2  some random text
     * @param  {string}   bullet3  some random text
     * @param  {object}   img      json with images
     * @param  {int}      weight   weight of the product in kg
     * @param  {Function} callback callback this method when loaded
     * @todo: use promisses
     */
    addProduct(
        sku, combination="", price="0", name="", upp=1, bullet1="",
        bullet2="", bullet3="", img="", weight=0, callback=$.noop
    )
    {
        // get product images
        img = img === "" ? this.getProductImage(sku, combination):img;

        var im = [];
        var images = {
            'url': img,
            'thumb_1': img,
            'thumb_200': img,
            'thumb_500': img
        };

        im.push(images);

        // doenst add quantity here, so dont cut the execution
        var cp = this.findProductBySKUCombination(sku, combination);

        if (!cp)
        {
            // create a new product and add to products
            cp = new CartProduct(
                sku, combination, price, name, upp,
                bullet1, bullet2, bullet3, im, weight
            );
            this.products.push(cp);
        }

        this.addOne(cp.id, callback);

    }

    addOne(id, callback=$.noop)
    {
        var p = this.findProductByID(id);
        if (p)
        {
            p.quantity += 1;
            this.saveCart(callback);
        }
    }

    getDiscount(code, site_name)
    {
        if (isNaN(code))
        {
            this.get('v1/discount/' + code, {"site_name": site_name}).then((response) =>
            {
                // Se utiliza != 0 porque discounts es json cuando tiene dato y es lista cuando no
                if (response.status === "success" && response.discounts.length != 0)
                {
                    if (response.discounts["activate"] === true)
                    {
                        this.percentage = response.discounts["percentage"];
                        this.discount_code = response.discounts["code"];
                        this.modelUpdate()
                        return
                    }
                }
                this.percentage = 0;
                this.discount_code = "";
                this.modelUpdate();
                $(".discount-message").html("Código inválido");
            });
        }
    }

    /**
     * send cart data throw post to API
     * @param  {Function} [callback=$.noop] callback function
     * @return {[type]}                   [description]
     */
    saveCart(callback=$.noop)
    {
        this.post('v1/cart/' + this.guid, {
            'items': JSON.stringify(this.products)
        }).then(()=>{
            callback();
        });
        this.modelUpdate();
    }

    findProductByID(id)
    {
        for (var i = 0; i < this.products.length; i++)
        {
            if (id === this.products[i].id)
            {
                return this.products[i];
            }
        }
        return false;
    }

    findProductBySKUCombination(sku, combination)
    {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].sku === sku &&
                this.products[i].combination === combination)
            {
                return this.products[i];
            }
        }

        return false;
    }

    /**
     * remove element from shopping cart
     * @param  {string} id  product id
     */
    removeProduct(id)
    {
        var index = this.findProductIndex(id);
        this.products.splice(index, 1);
        this.saveCart();
    }

    getProductID(sku, combination)
    {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].sku === sku &&
                this.products[i].combination === combination)
            {
                return this.products[i].id;
            }
        }
    }

    /**
     * remove one product from the cart
     * @param  {int} id  product id
     */
    removeOne(id)
    {
        var p = this.findProductByID(id);

        if (!p)
        {
            return false;
        }

        p.quantity -= 1;
        if (p.quantity <= 0)
        {
            this.removeProduct(id);
        }
        this.saveCart();
    }

    getProductTotal()
    {
        var total = 0;
        for (var i = 0; i < this.products.length; i++)
        {
            total += this.products[i].total;
        }

        return total;
    }

    getUPPTotal()
    {
        var total = 0;
        for (var i = 0; i < this.products.length; i++)
        {
            total += this.products[i].upp_total;
        }

        return total;
    }

    getUnitsTotal()
    {
        var units_total = 0;

        for (var i = 0; i < this.products.length; i++)
        {
            var product = this.products[i];
            units_total += product.quantity;
        }

        return units_total;
    }


    /**
     * get product image from id
     * @param  {int} id  product id
     * @return {string}    url with product image
     */
    getProductImage(sku, combination)
    {
        // implement this method outside
        return '';
    }

    getDiscountCode()
    {
        return this.discount_code;
    }

    getPercentage()
    {
        return this.percentage;
    }

}

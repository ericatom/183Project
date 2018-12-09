// This is the js for the default/index.html view.
var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.add_post = function () {
        // We disable the button, to prevent double submission.
        $.web2py.disableElement($("#add-post"));
        var sent_title = self.vue.form_title; // Makes a copy
        var sent_content = self.vue.form_content; //
        $.post(add_post_url,
            // Data we are sending.
            {
                post_title: self.vue.form_title,
                post_content: self.vue.form_content
            },
            // What do we do when the post succeeds?
            function (data) {
                // Re-enable the button.
                $.web2py.enableElement($("#add-post"));
                // Clears the form.
                self.vue.form_title = "";
                self.vue.form_content = "";
                // Adds the post to the list of posts.
                var new_post = {
                    id: data.post_id,
                    post_author: current_user_email,
                    post_title: sent_title,
                    post_content: sent_content
                };
                self.vue.post_list.unshift(new_post);
                // We re-enumerate the array.
                self.process_posts();
            });
        // If you put code here, it is run BEFORE the call comes back.
    };



    self.add_house = function () {
        var sent_name = self.vue.form_title; // Makes a copy
        $.web2py.disableElement($("#add-house"));
        $.post(add_house_url,
            // Data we are sending.
            {
                house_name: self.vue.form_title,
                hmember_email: current_user_email
            },
            // What do we do when the post succeeds?
            function (data) {
            	$.web2py.enableElement($("#add-house"));
                // Clears the form.
                self.vue.form_title = "";
                // Adds the post to the list of posts.
                var new_house = {
                    id: data.house_id,
                    house_name: sent_name,
                };

                self.get_house();
            });
        // If you put code here, it is run BEFORE the call comes back.
    };



    self.edit_chore = function (choreid) {
        var r = self.vue.chore_list[choreid];
        r.editing_chore = true;
    }


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            form_title: "",
            form_content: "",
            post_list: [],
            house_list:[],

            show_form: false,


        },
        methods: {
            add_post: self.add_post,
            toggle_form: function(){
                this.show_form = !this.show_form;
            },
            add_house: self.add_house,




        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {

        $("#add_house").show();
        self.get_house();

    }

    // Gets the posts.
    //self.get_posts();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

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


    self.add_event = function () {
        var to_send_event_title = self.vue.event_title;
        var to_send_event_description = self.vue.event_description;
        var to_send_creator_name = self.vue.creator_name;
        var to_send_creator_email = self.vue.creator_email;
        var to_send_event_category = "Sports";
        var to_send_event_description = self.vue.event_description;
      
        $.web2py.disableElement($("#add-event"));
        $.post(add_event_url,
            // Data we are sending.
            {
                event_title: self.vue.event_title,
                event_description: self.vue.event_description
            },
            // What do we do when the post succeeds?
            function (data) {
                $.web2py.enableElement($("#add-event"));
                // Clears the form.
                self.vue.event_title = "";
                self.vue.event_description = "";
                // Adds the post to the list of posts. 
                var new_event = {
                    id: data.event_id,
                    event_title: to_send_event_title,
                    event_description: to_send_event_description,
                    creator_name: to_send_creator_name,
                    creator_email: to_send_creator_email,
                    event_category: to_send_event_category,
                };
               // self.get_events();
            });
        // If you put code here, it is run BEFORE the call comes back.
    };

/*    self.get_events = function() {
        $.getJSON(get_house_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.

                self.vue.house_list = data.house_list;

                // Post-processing.
                if(data.house_list.length!==0){
                    self.get_chore_list(data.house_list[0].house_id);
                    self.get_hmember_list(self.vue.house_list[0].house_id);
                }

            }
        );
        console.log("I fired the get");
    };

*/

    self.process_events = function() {
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts.
        // We add the _idx attribute to the posts.
        enumerate(self.vue.chore_list);
        // We initialize the smile status to match the like.
        self.vue.chore_list.map(function (e) {
            // I need to use Vue.set here, because I am adding a new watched attribute
            // to an object.  See https://vuejs.org/v2/guide/list.html#Object-Change-Detection-Caveats
             Vue.set(e, 'editing_chore', false);
        });
    };



    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            event_title: "",
            event_description: "",
            creator_name: "",
            creator_email: "",
            event_category: "",
            size_limit: 4,
            show_event_form: false,
            event_list: [],


        },
        methods: {
            add_event: self.add_event,
            toggle_form: function(){
                this.show_event_form = !this.show_event_form;

            },
        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {
        $("#add_event").show();
    }

    // Gets the posts.
    self.get_posts();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

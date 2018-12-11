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

    self.get_events = function () {
        $.getJSON(get_events_list_url,
            function(data) {
                // I am assuming here that the server gives me a nice list
                // of posts, all ready for display.
                console.log("event_list: ", data.event_list);
                self.vue.event_list = data.event_list;
                console.log("the event", self.vue.event_list);
                // Post-processing.
                self.process_events();
                console.log("I got my list");
            }
        );
        console.log("I fired the get");
    }


    self.process_events = function () {
        // This function is used to post-process posts, after the list has been modified
        // or after we have gotten new posts.
        // We add the _idx attribute to the posts.
        enumerate(self.vue.event_list);
        self.vue.event_list.map(function (e) {
            Vue.set(e, 'editing_event', false);

        });

    };

    self.add_event= function () {
        var to_send_event_title = self.vue.event_form_title;
        var to_send_event_content = self.vue.event_form_content;
        var to_send_creator_name = curr_user_first_name;
        var to_send_creator_email = curr_user_email;
        var to_send_event_category = self.vue.event_form_category;
      
        $.web2py.disableElement($("#add-event"));
        $.post(add_event_url,
            // Data we are sending.
            {
                event_title: self.vue.event_form_title,
                event_content: self.vue.event_form_content,
                creator_email: curr_user_email,
                creator_name: curr_user_first_name,
                event_category: self.vue.event_form_category,
                size_limit: 4
      
            },
            // What do we do when the post succeeds?
            function (data) {
                $.web2py.enableElement($("#add-event"));
                // Clears the form.
                self.vue.event_form_title = "";
                self.vue.event_form_content = "";
                self.vue.event_form_category = "";
                // Adds the post to the list of posts. 
                var new_event = {
                    id: data.event_id,
                    event_title: to_send_event_title,
                    event_content: to_send_event_content,
                    creator_name: to_send_creator_name,
                    creator_email: to_send_creator_email,
                    event_category: to_send_event_category,
                    size_limit: 4
                };
                self.vue.event_list.unshift(new_event);
                self.process_events();
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
            display_event_form: false,
            event_form_title: "",
            event_form_category: "",
            event_form_content: "",
            event_list: [],


        },
        methods: {
            toggle_form: function(){
                this.display_event_form = !this.display_event_form;
            },
            add_event: self.add_event,
            process_events: self.process_events,
            get_events: self.get_events,




        }

    });

    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {

        $("#add_event").show();
        self.get_events();

    }

    // Gets the posts.
    self.get_events();

    return self;
};

var APP = null;

// No, this would evaluate it too soon.
// var APP = app();

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

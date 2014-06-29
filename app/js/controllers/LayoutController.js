define(['marionette'], function (Marionette) {
  CoupController = Marionette.Controller.extend({

    initialize: function(options){
      // store a region that will be used to show the stuff rendered by this component
      this.mainRegion = options.mainRegion;
    },

    // call the "show" method to get this thing on screen
    show: function(){
      // get the layout and show it
      var layout = this._getLayout();
      this.mainRegion.show(layout);
    },

    // build the layout and set up a "render" event handler.
    // the event handler will set up the additional views that
    // need to be displayed in the layout. do this in "render"
    // so that the initial views are already rendered in to the
    // layout when the layout is displayed in the DOM
    _getLayout: function(){
      var layout = new MyLayout();

      this.listenTo(layout, "render", function(){
        this._showMenuAndContent(layout);
      }, this);

      return layout;
    },

    // render the menu and the initial content in to the layout.
    // set up an event handler so that when the menu triggers the
    // event, the content will be changed appropriately.
    _showMenuAndContent: function(layout){

      var menu = this._addMenu(layout.menu);
      this._initialContent(layout.content);

      // this is a custom event triggered from the menu view.
      // it doesn't matter what the event name is. it just needs
      // to be triggered at the right time, from the menu view.
      menu.on("some:event", function(){
        // when the event is triggered, change the content in
        // the "content" region of the layout
        this._changeContent(layout.content);
      }, this);
    },

    // add the menu to the region specified, and return it
    // so it can be used for events, etc
    _addMenu: function(region){
      var menu = new MyMenu();
      region.show(menu);
      return menu;
    },

    // add the initial content to the region specified
    _initialContent: function(region){
      var view = new InitialContentView();
      region.show(view);
    },

    // change the content in the region specified
    _changeContent: function(region){
      var view = new AnotherContentView();
      region.show(view);
    }
  });
});
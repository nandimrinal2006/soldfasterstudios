function createStickyHeaderForPage( page_specific_id, sticky_class_name){
 
  if (document.getElementById(page_specific_id)) {
    window.onscroll = function() {
      //console.log("hi23");
      var header = document.getElementById(page_specific_id);
      var sticky = header.offsetTop;

      if (window.pageYOffset > sticky) {
        header.classList.add(sticky_class_name);
      } else {
        header.classList.remove(sticky_class_name);
      }

    }
 }
}
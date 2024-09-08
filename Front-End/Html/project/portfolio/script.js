function togglemenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".mobile-icon");
  // when its toggled/pressed open the class .menu-links.open
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

/*
In your code, the togglemenu() function dynamically adds or removes the open class to both the .menu-links and .mobile-icon elements when clicked:

For .menu-links:

By default, the .menu-links is hidden (display: none;).
When the open class is added (.menu-links.open), the menu becomes visible (display: block;), allowing the items to be shown.
When you click the menu icon: It adds the open class to .menu-links, making the menu visible.
When you click again: It removes the open class, hiding the menu again.
For .mobile-icon:

The open class here is used to transform the appearance of the icon into an "X" to indicate the menu can be closed:
The first span rotates and moves to create part of the "X".
The second span (middle line) becomes invisible.
The third span rotates and moves to complete the "X".
When you click the icon: It adds the open class to .mobile-icon, transforming the icon to an "X".
When you click again: It removes the open class, returning the icon to its original "hamburger" menu state.
In summary, each time you click the menu icon, it toggles between showing/hiding the .menu-links and switching the .mobile-icon between a "hamburger" and an "X".
 */
/*
 when you click the menu link (or the button that triggers the togglemenu() function), 
 it removes the open class if it’s already applied. 
 This is how the toggle() method works: it adds the open class if it’s not there, and removes it if it is.
 */

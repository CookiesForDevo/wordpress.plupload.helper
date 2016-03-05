wordpress.plupload.helper v0.1b
=====

Summary
---

### So what is it?

**wordpress.plupload.helper** is a small wrapper made to help generate file upload areas quickly and easily. It doesn't utilize the full power of the [Plupload API](http://www.plupload.com/docs/API), and isn't meant to cover every use case. But what it does cover is basic uploader usage and automates a lot of default options, settings, and methods. 


Installation
---

### How do I get it?

It's recommended that you include it through bower components, however, you may also download the archive and add it to your theme manually. 


Usage
---

### Setup

There's two ways to go about including the styles and scripts. The recommended way is bundling the CSS and JS into your existing files through SASS and a JavaScript include system ([CodeKit](https://incident57.com/codekit/) does a wonderful job of this).

```css
@import "../../bower_components/wordpress.plupload.helper/sass/wordpress.plupload.helper.scss";
```
```js
// @codekit-prepend "../../bower_components/wordpress.plupload.helper/js/min/wordpress.plupload.helper-min.js";
```

The other method is to register and enqueue the scripts.

```php
<?php
	add_action('wp_print_scripts', 'enqueue_plupload_helper');
	add_action('admin_print_scripts', 'enqueue_plupload_helper');
	function register_plupload_helper() {
		wp_register_style('plupload-helper', get_stylesheet_directory_uri() . '/bower_components/wordpress.plupload.helper/css/wordpress.plupload.helper.css', false, '0.1b', 'screen');
		wp_register_script('plupload-helper', get_stylesheet_directory_uri() . '/bower_components/wordpress.plupload.helper/js/min/wordpress.plupload.helper-min.js', array('jquery','plupload-all'), '0.1b', true);
	}
?>
```

Now that everything is registered, it needs to be enqueued for that page. This can either be done in the same function, or just on that particular page so you're not loading it extraneously. 
```php
<?php
	wp_enqueue_style('plupload-helper');
	wp_enqueue_script('plupload-all');
	wp_enqueue_script('plupload-helper');
?>
```

You're also going to need to include the archives `functions.php` file as this includes a few site variables (encoded for JavaScript) and some HTML for the loading screen. 
```php
<?php
	include get_stylesheet_directory() . '/bower_components/wordpress.plupload.helper/php/functions.php';
?>
```


### Basic Configuration

A very basic default configuration would look something like this.
```html
<div
	class="js-plupload-scope-wrap" 
	data-action="sample_file_upload" 
>

	<div class="attachment-image-area js-response-area">
	</div>

	<div class="pl-container js-plupload-upload-ui">
		<div class="pl-drag-area js-plupload-drag-drop-area">
			<a class="pl-browse js-plupload-browse">
				<p>Drop files or click to upload.</p>
			</a>
		</div>
	</div>

	<div class="js-response-message upload-message-area">
		
	</div><!-- .js-message-area -->

</div>
```

And add this to your JavaScript to initialize it.
```js
$(document).ready( function() {
	$('.js-plupload-scope-wrap').DoPlupload();
});
```

### Options
Options may be passed either when initializing the JavaScript and/or through data attributes on the wrapper. As the data attributes are parsed last and per uploader, you can use them to tweak settings without adding multiple JavaScript initializations.  

```js
action				: 'sample_file_upload',
```
Tells WordPress which PHP function to call through AJAX. You'll need a corresponding function and action calls to trigger correctly. See `sample_file_upload` in `php/functions.php`.

```js
browse_button		: '.js-plupload-browse',
container			: '.js-plupload-upload-ui',
drop_element		: '.js-plupload-drag-drop-area',
```
Required elements for Plupload to work.

```js
response_message	: '.js-response-message',
response_area		: '.js-response-area',
```
Defined areas for updating the DOM with messages (success and error), and the AJAX response.

```js
multiple_queues		: false,
multi_selection		: false,
```
Set to true if you want to upload multiple files at a time.

```js
mime				: 'image',
extensions			: 'bob',
```
Use `mime` to pull one of the predefined sets of allowed extensions. Options include `zip`, `doc`, `csv`, and `image`. If you need to set a more esoteric file extension, you may override the defaults by setting it through `extensions`. Once set, anything under `mime` will be ignored. 

### So what is it?
[sigh](https://www.youtube.com/watch?v=TxWN8AhNER0)

License
---
Licensed under the MIT License


Authors
---

Copyright(c) 2016 [Devon Crosby](https://theexperiment.ca/)


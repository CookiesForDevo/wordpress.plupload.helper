<?php
	/**
	 * 
	 * Passes some handy WordPress settings in a format that JavaScript likes
	 * 
	 */
	add_action('wp_print_scripts', 'localize_plupload');
	add_action('admin_print_scripts', 'localize_plupload');
	function localize_plupload() {

		wp_localize_script(
			'jquery',
			'wpData', 
			array( 
				'siteURL'		=> get_bloginfo('url'), 
				'templateURL'	=> get_stylesheet_directory_uri(), 
				'ajaxURL'		=> admin_url('admin-ajax.php'),
				'includesURL'	=> includes_url(),
				'maxUP'			=> wp_max_upload_size()
			) 
		);

	}

	/**
	 * 
	 * Adds some HTML to the footer to show file upload progress
	 * 
	 */
	add_action('wp_footer', 'pluploader_loading_html');
	add_action('admin_footer', 'pluploader_loading_html');
	function pluploader_loading_html() {
?>

	<div class="plupload-overlay">

		<div class="plupload-content-wrap">
			<h2>Incoming Files</h2>
			<ul id="js-incoming-files" class="incoming-files">
			</ul><!-- .incoming-files -->
		</div><!-- .plupload-content-wrap -->

	</div><!-- .plupload-overlay -->

<?php
	}

	/**
	 * 
	 * Sample ajax file saving
	 * 
	 */
	add_action('wp_ajax_sample_file_upload', 'sample_file_upload'); // logged in
	add_action('wp_ajax_nopriv_sample_file_upload', 'sample_file_upload'); // not logged in
	function sample_file_upload() {

		check_ajax_referer( 'sample_file_upload', 'nonce' );

		$files = $_FILES['async-upload'];

		if ( $files && ! function_exists( 'wp_handle_upload' ) ) {
			include ABSPATH . 'wp-admin/includes/image.php';
		}

		$status = wp_handle_upload( 
			$files, 
			array( 
				'test_form' => false, 
				'action' => 'sample_file_upload' 
			)
		);

		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' 	=> $status['type'],
				'post_title' 		=> preg_replace( '/\.[^.]+$/', '', basename( $files['name'] ) ),
				'post_content' 		=> '',
				'post_parent'		=> 0,
				'post_status' 		=> 'inherit'
			),
			$status['file'],
			$post_id
		);

		$meta = wp_generate_attachment_metadata( $attachment_id, $status['file'] );
		wp_update_attachment_metadata( $attachment_id, $meta );

		echo wp_get_attachment_image( $attachment_id, 'thumbnail' );

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			exit;
		}

	}
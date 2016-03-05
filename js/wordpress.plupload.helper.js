/* global jQuery,plupload,wpData */
(function($) {

	var DoPlupload = window.DoPlupload;

	DoPlupload = (function() {

		function DoPlupload( scope, params, iteration ) {

			var _ = this;

			_.scope = $(scope);
			_.iteration = iteration;
			_.uploader = {};
			_.config = {};
			_.default_mime_types = {
				zip : {
					title : "Archives", 
					extensions : "zip,rar"
				},
				doc : {
					title : "Documents", 
					extensions : "doc,docx,xls,xlsx,ppt,pptx,txt,rtf,csv,pdf"
				},
				csv : {
					title : "CSV", 
					extensions : "csv"
				},
				image : {
					title : "Image files", 
					extensions : "jpeg,jpg,gif,png,svg"
				}
			};

			_.defaults = {
				// should never need to change
				runtimes				: 'html5,silverlight,flash,html4',
				file_data_name			: 'async-upload',
				url						: wpData.ajaxURL,
				flash_swf_url			: wpData.includesURL + 'js/plupload/plupload.flash.swf',
				silverlight_xap_url		: wpData.includesURL + 'js/plupload/plupload.silverlight.xap',
				multipart				: true,
				urlstream_upload		: true,
		
				// will probably want to change
				action					: 'sample_file_upload',
				
				browse_button			: '.js-plupload-browse',
				container				: '.js-plupload-upload-ui',
				drop_element			: '.js-plupload-drag-drop-area',

				response_message		: '.js-response-message',
				response_area			: '.js-response-area',
		
				multiple_queues			: false,
				multi_selection			: false,
				filters : {
					max_file_size : wpData.maxUP + 'b',
					mime_types : [
						_.default_mime_types.image
					]
				},
			};


			// merge defaults, params, and data-*
			_.config = $.extend( _.defaults, params, _.data );


			// if a custom extension has been set, use those
			if ( _.config.extensions ) {
				_.config.filters.mime_types.extensions = _.config.extensions;

			} else if ( _.config.mime && _.default_mime_types.hasOwnProperty( _.config.mime ) ) {
				_.config.filters.mime_types = _.default_mime_types[ _.config.mime ];

			} //endif


			// store extra info in the multipart_params
			_.config.multipart_params = $.extend( _.config.multipart_params, _.scope.data() );


			// plupload requires IDs. If the specified elements don't have an ID, add it
			_.config.browse_button = _.parseSelector( _.config.browse_button );
			_.config.container = _.parseSelector( _.config.container );
			_.config.drop_element = _.parseSelector( _.config.drop_element );

			// make a new uploader
			_.uploader = new plupload.Uploader( _.config );
			_.uploader.init();

			// checks if browser supports drag and drop upload, makes some css adjustments if necessary
			_.uploader.bind( 'init', function( up ) {
				var uploaddiv = $('#' +  up.settings.container );

				if ( up.features.dragdrop ) {
					uploaddiv.addClass('drag-drop');
		
					// handles drag events, adds or removes classes
					$('#' + _.config.drop_element )
						.bind('dragover', function() { 
							uploaddiv.addClass('drag-over');
			
						})
						.bind('dragleave.drag-drop, drop.drag-drop', function() {
							uploaddiv.removeClass('drag-over');
			
						})
					;
		
				} else {
			 		uploaddiv.removeClass('drag-drop');
					$('#' + up.settings.drop_element ).unbind('#' + up.settings.drop_element);

				} //endif

			});


			// y u cause problems
			_.uploader.bind('Error', function( up, error ) {
		
				_.scope.find( _.config.response_message ).slideUp('slow', function() {
					_.scope.find( _.config.response_message  ).html( error.message ).slideDown('slow');
				});
		
			});


			// a file was added in the queue
			_.uploader.bind('FilesAdded', function( up, files ) {
				_.showUploadStatus();

				up.refresh();

				$(document).find('#js-incoming-files').slideUp('slow', function() {
					var fileList = $(this);
					fileList.empty();
					fileList.slideDown('fast');
					plupload.each( files, function( file ) {
						fileList.append('<li id="' + file.id + '"><span class="plupload-file-name">' + file.name + '</span><span class="plupload-size">(' + plupload.formatSize( file.size ) + ')</span><span class="js-status plupload-status">0%</span></li>');
					});

					up.start();
				});
		
			});


			// now we're uploading!
			_.uploader.bind('UploadProgress', function( up, file ) {
				var el = $(document).find('#' + file.id);
				el.addClass('active').siblings().removeClass('active');
				el.find('.js-status').html( file.percent + '%');
			});


			// a file was uploaded 
			_.uploader.bind('FileUploaded', function( up, file, response ) {
		
				// this is your ajax response, update the DOM with it or something...
				if ( up.settings.multi_selection ) {
					_.scope.find( _.config.response_area ).append( response.response );
		
				} else {
					_.scope.find( _.config.response_area ).slideUp('slow', function() { this.html( response.response ).slideDown('slow'); } );
		
				}
		
			});


			//all done
			_.uploader.bind('UploadComplete', function() {

				_.scope.find( _.config.response_message ).slideUp('slow', function() {
					_.scope.find( _.config.response_message ).html('Items have been uploaded!').slideDown('slow', function() {
						_.hideUploadStatus();
					});
				});
		
			});

		}

		return DoPlupload;

	}());


	DoPlupload.prototype.parseSelector = function( element ) {

		var _ = this;

		if ( '#' === element[0] ) {
			return element.substring(1);

		} else if ( ! _.scope.find( element ).prop('id') ) {
			_.scope.find( element ).prop('id', element.substring(1)  + '-' + _.iteration);
			return element.substring(1)  + '-' + _.iteration;

		} //endif

	};


	DoPlupload.prototype.showUploadStatus = function() {
		$('body').addClass('pluploader-active');
	};


	DoPlupload.prototype.hideUploadStatus = function() {
		$('body').removeClass('pluploader-active');
	};


	$.fn.DoPlupload = function() {

		var
			l = this.length,
			c = 0
		;

		for ( c; c < l; c++ ) {
			this[c].DoPlupload = new DoPlupload( this[c], arguments[0], c );
		}

		return this;

	};


}(jQuery));
!function($){var e=window.DoPlupload;e=function(){function e(e,s,o){var n=this;n.scope=$(e),n.iteration=o,n.uploader={},n.config={},n.default_mime_types={zip:{title:"Archives",extensions:"zip,rar"},doc:{title:"Documents",extensions:"doc,docx,xls,xlsx,ppt,pptx,txt,rtf,csv,pdf"},csv:{title:"CSV",extensions:"csv"},image:{title:"Image files",extensions:"jpeg,jpg,gif,png,svg"}},n.defaults={runtimes:"html5,silverlight,flash,html4",file_data_name:"async-upload",url:wpData.ajaxURL,flash_swf_url:wpData.includesURL+"js/plupload/plupload.flash.swf",silverlight_xap_url:wpData.includesURL+"js/plupload/plupload.silverlight.xap",multipart:!0,urlstream_upload:!0,action:"sample_file_upload",browse_button:".js-plupload-browse",container:".js-plupload-upload-ui",drop_element:".js-plupload-drag-drop-area",response_message:".js-response-message",response_area:".js-response-area",multiple_queues:!1,multi_selection:!1,filters:{max_file_size:wpData.maxUP+"b",mime_types:[n.default_mime_types.image]}},n.config=$.extend(n.defaults,s,n.data),n.config.extensions?n.config.filters.mime_types.extensions=n.config.extensions:n.config.mime&&n.default_mime_types.hasOwnProperty(n.config.mime)&&(n.config.filters.mime_types=n.default_mime_types[n.config.mime]),n.config.multipart_params=$.extend(n.config.multipart_params,n.scope.data()),n.config.browse_button=n.parseSelector(n.config.browse_button),n.config.container=n.parseSelector(n.config.container),n.config.drop_element=n.parseSelector(n.config.drop_element),n.uploader=new plupload.Uploader(n.config),n.uploader.init(),n.uploader.bind("init",function(e){var s=$("#"+e.settings.container);e.features.dragdrop?(s.addClass("drag-drop"),$("#"+n.config.drop_element).bind("dragover",function(){s.addClass("drag-over")}).bind("dragleave.drag-drop, drop.drag-drop",function(){s.removeClass("drag-over")})):(s.removeClass("drag-drop"),$("#"+e.settings.drop_element).unbind("#"+e.settings.drop_element))}),n.uploader.bind("Error",function(e,s){n.scope.find(n.config.response_message).slideUp("slow",function(){n.scope.find(n.config.response_message).html(s.message).slideDown("slow")})}),n.uploader.bind("FilesAdded",function(e,s){n.showUploadStatus(),e.refresh(),$(document).find("#js-incoming-files").slideUp("slow",function(){var o=$(this);o.empty(),o.slideDown("fast"),plupload.each(s,function(e){o.append('<li id="'+e.id+'"><span class="plupload-file-name">'+e.name+'</span><span class="plupload-size">('+plupload.formatSize(e.size)+')</span><span class="js-status plupload-status">0%</span></li>')}),e.start()})}),n.uploader.bind("UploadProgress",function(e,s){var o=$(document).find("#"+s.id);o.addClass("active").siblings().removeClass("active"),o.find(".js-status").html(s.percent+"%")}),n.uploader.bind("FileUploaded",function(e,s,o){e.settings.multi_selection?n.scope.find(n.config.response_area).append(o.response):n.scope.find(n.config.response_area).slideUp("slow",function(){this.html(o.response).slideDown("slow")})}),n.uploader.bind("UploadComplete",function(){n.scope.find(n.config.response_message).slideUp("slow",function(){n.scope.find(n.config.response_message).html("Items have been uploaded!").slideDown("slow",function(){n.hideUploadStatus()})})})}return e}(),e.prototype.parseSelector=function(e){var s=this;return"#"===e[0]?e.substring(1):s.scope.find(e).prop("id")?void 0:(s.scope.find(e).prop("id",e.substring(1)+"-"+s.iteration),e.substring(1)+"-"+s.iteration)},e.prototype.showUploadStatus=function(){$("body").addClass("pluploader-active")},e.prototype.hideUploadStatus=function(){$("body").removeClass("pluploader-active")},$.fn.DoPlupload=function(){var s=this.length,o=0;for(o;s>o;o++)this[o].DoPlupload=new e(this[o],arguments[0],o);return this}}(jQuery);
// jshint ignore: start

import FileUploader from '@ckeditor/ckeditor-cloudservices-core/src/uploadgateway/fileuploader';
import UploadGateway from '@ckeditor/ckeditor-cloudservices-core/src/uploadgateway/uploadgateway';

window.CKEDITOR = ( window.CKEDITOR || {} );

window.CKEDITOR.cloudServices = {
	FileUploader,
	UploadGateway
};

export {
	FileUploader,
	UploadGateway
};

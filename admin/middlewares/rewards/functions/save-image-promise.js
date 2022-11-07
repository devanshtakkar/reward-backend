
function saveImage(fileObject, name) {
	return new Promise((resolve, reject) => {
		//reject if there is no image
		if (!fileObject?.image) {
			reject(new ImageError("Either the image is too large or not provided in the request"));
		}
		let image = fileObject.image;
		let imageName = `${name}.jpg`;
		image.mv(`files/reward-images/${imageName}`, (error) => {
			if (error) {
				reject(new ImageError(error.message));
			} else {
				resolve(`Image saved as ${imageName}`);
			}
		});
	});
}

class ImageError extends Error{
	constructor(message){
		super(message);
		this.name = "ImageError"
	}
}

export default saveImage

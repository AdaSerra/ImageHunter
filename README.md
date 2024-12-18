# Hunter Image


## Introduction 

This is add-on for Firefox written in JavaScrpit that allows you to find all images in a web page. Images are displayed in a vertical list with additional data if available, such as size and date and a summary data of whole web page.

## Features

- **Image Search**: Searches for all images on a web page from HTML elements with image tags, svg, images used as backgrounds in CSS, and all images in `<picture source>` tags.
- **Image Data**: Image data is taken from the browser's `PerformanceResourceTiming` API and intercpeting  response headers of web requests. If nothing is found, a temporary blob object is generated to get the raw data.
- **Exclusions**: No images are taken from `<iframe>` or `<video>` tags. The copy function for svg is a issue because the ClipboardItem Api on Firefox does not support MIME type image/svg+xml.
- **User Interface**: Uses [React](https://react.dev/) and [Ant Design](https://ant.design/).
- **Image Actions**: For each image, you can save it, copy it, search for it on Google Images or other image search engines, or select it and put it in a temporary list from which only selected images will be downloaded later.
- **Metadata**: Through the [ExifReader](https://github.com/mattiasw/ExifReader) library it is possible to obtain the metadata of the image if it is in a supported format.
- **Report**: It is possible to download a summary report of the image or a summary of all the images on the web page.
- **Filters**: From the options menu you can filter the images to be displayed based on file extension, size in pixels and bytes, and choose your preferred image search engine.

## Screenshoots

<img src="./screenshoots/example1.jpg" width="400" height="225">
<img src="./screenshoots/example2.jpg" width="400" height="225">
<img src="./screenshoots/example4.jpg" width="400" height="225">
<img src="./screenshoots/example5.jpg" width="400" height="225">

## Next steps
- Improve handling of svg 
- Make a version for Chrome and other browser
- Localize add-on through framework like i18next
- Improve the graphics by creating for example a custom icon
- Make possible the reverse search also for images in base64
- Improve reports output

 ## Testing

Clone this repository
```
npm install
npm run build:dev
npm run firefox
``` 
or [Download from here](https://addons.mozilla.org/it/firefox/addon/image-hunter/)
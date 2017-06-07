# Microsite Generator

Deploys static sites that share a common style wrapper inspired by the **ScanLABProjects.co.uk** homesite.

The site comes built with some core components which allow for up to speed, up to date performance on all devices and screen sizes, as well as features such as the custom built in video player, and mailing list component.

### Installation

	npm install // yarn doesnt run the postinstall script
	
Ensure the `npm run postinstall` script has been executed
	
Setup server targets in the `package.json` config:

	"assets": "/Volumes/MONDO/001_PROJECTS/000_WEBSITE/microsite/assets/",
    "images": "/Volumes/MONDO/001_PROJECTS/000_WEBSITE/microsite/images/",
    "release": "/Volumes/MONDO/001_PROJECTS/000_WEBSITE/microsite/release/",
    "target": "AWS BUCKET", // s3://scanlabprojects.co.uk
    "port": "3000"	
*(assumes server:MONDO is mounted on system)*

### Directory contents

* `_raw` page boilerplate
* `_scripts` node.js build scripts
* `_images` local images sync folder from server
* `_vendor` any 3rd party libs
* `dist` recent release that are in sync with the MONDO location where the candidate is shipped from
* `public` local test build
* `views` site structure is derived from here
* `MONDO/**/microsite/`: `images | assets` manage static assets here

### Development

Watch & develop locally

	npm start // runs in dev mode and builds to public 

### Deploy

Production build to `/dist/`

	npm run build

Sync to AWS | Mondo

	npm run release	



---


### Create New {page}

The `id` will be important as it will correlate to the url and directory folder. If there are hyphens used, then in the config file they are stripped out to work with Jade's localised JS object. It is recommended to kebab-case the uid as so to be url friendly.

    id=uniqueName npm run create:page 

Pages will scaffold out into their respective `/views` directory  

Use the relative `layout.jade` to organise the page layout, using the `config.js` to structure specific local variables for the HTML render.

Local variables can be accessed in `jade` via the following convention: `[projectname].meta.title` 

Images will be pulled directly in order from the server and be populated into the `config.js`, as collections, otherwise by `tags`: `filename--tag.jpg`

* `--hero`
* `--slide`
* `--banner`

Scripts are loaded per page type: `main.js | {page}.js`, and any specific extras can be loaded in via the script config.

### Image syncing from Mondo

The folder paths must match the same uid as pages used in config. This way they are synced to their relative locations.

The uid images folders must include a `_lowres` folder, where `mobile` images will be generated.

Images put in an `originals` or `ss` directory will not be synced.

---

**Banner images**

convention: {name}—banner.jpg

`1180px x 472px`  
image ratio `.4`

---

**Hero image**

convention: {name}—hero.jpg

`2560px x 1440px`  
image ratio `.562`

Due to the responsive viewing window of a project page, the perceived height is actually 80% of 1440px (1152px) .. *browsers each behave differently to this - thus is under Q&A* 

---

**Standard image**

image ratio `.562`  
max width 1180px  
height 663.16


---

### Writing HTML Pages

Build up HTML using `Jade` templates.  
**Use 2 spaces - not tabs**

### Hero

Define Hero image | media
	
	+hero(root.hero, "vimeo") // {config.hero, video-type}
	
* "vimeo" : adds a vimeo player as hero
* "video" : adds a HTML5 player as hero
* "" : will use a static image, and also is required as fallback for mobile

### Sections

Sections will default to Text types .. `+section("type", "custom-class")`

Add `<section>`, with `<header>`
	
	+section
	  +block("header")
	    h1 Title
	  +block
	  	p Lorem ipsum dolor sit met, consectetur adipiscing elit.


Add `<section>`, without `<header>`
	
	+section
	  +block
	    p Lorem ipsum dolor sit met, consectetur adipiscing elit.
	    
Add custom `<section>`
	
	+section("type", "custom-class")
	  +block
	    +figure("fullpath", "caption")
	    
	
### Images

Add single image figure, wrapped with `<section>`
	
	+singleImage("filename", "caption")

Multiple image block
	
	+imageBlock(projectMeta, [
	  {src, caption},
	  [["*.jpg", "*.jpg"], ["caption", "caption"], "is-square"],
	  {src, caption"}
	])
	
* `projectMeta` : *object* : `config name` (of local jade variable for project) 
* `src` : *string* : `filename` relative path is automated
* `caption` : *string*
* `[]` : *Array* : use for inline `+imageColumns` mixin 
	* ["filename", "filename"]
	* ["caption", "caption"]
	* "classname" : "" default : "is-square"
	
	
## Config JSON

Some of the info is auto generated at the `npm create:page | project`

	hero: {        
        title: "Hero title description",
        caption: "",
        img: "/assets/home/home-temp.jpg",
        video: "/assets/showreel.mp4",
        vimeo: "https://player.vimeo.com/video/145248208"
    },
	body: {
        title: "Page Title",
        client: "Client name"
    },
    meta: {
        href: "kebab-case-url",
        title: "HTML Browser Title",
        description: "HTML meta desc",
        active: true,
        tags: ['artwork', 'installation', 'film']
    },
    // will add custom page script
    script: {
        use: false,
        src: "/js/custom.js"
    },
    images: {
    	banner: auto gen via --banner
    	hero: auto gen via --hero,
    	path: auto gen full path to page assets
    }
    
---

### Home page

The homepage has a specific conifg param `selected` where the Selected Projects are set. An Array with `{ src. caption, client, url, tags:[] }`

The ***Homepage** `body.video` param requires `_hires` folder path version for HD video, which will be at the same level as the video file : currently in `/assets/home/`

`body.hero` is the Hero image, which will display on **mobile** only.

## Build process steps

`{target : dist}`

1. sync all images from server to local _images folder
2. create new configs from home | pages | work
3. [production mode] compile JS | CSS && minimise
4. copy assets
5. compile index HTML from home | pages | work
6. prep & run SSR command for Vue component page (/work)
7. If successful, commit and deploy with AWS sync

## SSR

A Vue Component is being used at `/work/index.html`, for SEO and ZERO page flash, SSR has been implemented. Below is the run through process:

Vue component is built as normal on a page with a `#mountpoint` on its `layout.jade` with a **clientside** script `js/works-clientside.js` which will hydrate upon the server rendered output of `work/index.html`. The Vue HTML Template is built from `jade` at `views/_vue-templates/works.jade`, which is used at both client and serverside. The SSR happens via the `_scripts/render.js` where it compiles the HTML output from `js/ssr/works-server` and injects it to `work/index.html` from where it will be delivered statically.

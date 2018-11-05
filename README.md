![San Francisco Brewers Guild](https://i.imgur.com/yv1g0Rg.png)

# Bay Area Brewers Guild Platform

## Table Of Contents
1. [Overview](#overview)
1. [Proposed Timeline](#proposed-timeline)
1. [Tech Stack](#technology-stack)
1. [Schema Design](#schema-design)
1. [Members Portal User Stories](#members-portal-user-stories)
1. [Public Site User Stories](#public-site-user-stories)
1. [SF Beer Week/Festival Platform User Stories ](#festival-platform-user-stories )
1. [File Structure](#file-structure)
1. [Configuring the API Keys and Services](#configuring-the-api-keys-and-services)
1. [Running the Application](#running-the-application)
1. [Wire Frame (TBD)](#wire-frame)
1. [Mile Stones](#mile-stones)
1. [Tentative Sprint Schedule](#sprint-schedule)
1. [Database Models Reference](#database-models-reference)
1. [Extra Considerations](#extra-considerations)

A production branch of this application will live on [https://babg-portal.herokuapp.com](https://babg-portal.herokuapp.com).

Available logins are
	- master@paradeigm.com
	- chapter@paradeigm.com
	- agent@paradeigm.com
	- member@paradeigm.com
	Password: password


# Overview
**Background:**
*Formed in 2004, the San Francisco Brewers Guild was created to preserve San Franciscos brewing heritage and unite those who make local beer with those who love it. The SF Brewers guild organizes and hosts events such as SF Beer Week, advocates for craft beer in city government, donates services/products to local charities, and partners with artisan producers of food, beverage, hospitality and agricultural industries.*
[Original Request For Proposal (RFP)](https://s3-us-west-1.amazonaws.com/bayareabrewersguild/SFBGTechPlatform_20180501_RFP_Final+(2).pdf)

**Membership Structure Resources**
- [Allied Trade Kit](https://s3-us-west-1.amazonaws.com/bayareabrewersguild/SFBG18_Allied+Trade+Kit_v20180615_sp.pdf)
- [Affiliate Membership Benefits](https://s3-us-west-1.amazonaws.com/bayareabrewersguild/SFBG+Membership+Benefits_2016_AFFILIATES.pdf)
- [Proposed Membership Benefits (05/10/2018)](
https://s3-us-west-1.amazonaws.com/bayareabrewersguild/SFBABG_Membership+Benefits_Proposed_20180510.pdf)

**High Level Scope**
*As a growing organization, the SF Brewers Guild will soon exist as multiple regional chapters of the Bay Area. As such, the need for highly scalable technology to manage different memberships types on a variety of platforms/interfaces to ultimately promote the Guild and related activities as needed.*

# **Proposed Timeline**

 - **Phase 1**: *08-30-2018*
- **Phase 2**: *09-21-2018*
- **Phase 3**: *10-01-2018*

## **Phase 1 Overview**

**Goal**

*Provide a scalable initial product capable of allowing brewery/affiliate members to sign up to the Association Management platform and manage events/beer releases/other member activites. Along with this a public site with chapter landing sites which would pull such information for end-users to peruse.*

**Details**

*Member only Association management system with member signups, dues management/billing, member/individual profiles, media management, and event submissions. Administrative association management system for chapters, brewery members, and affiliate members with accompanied public sites including numerous UI Components for viewing member activites (events and beer releases).*
&nbsp;

## **Phase 2 Overview**

**Goal**

*Provide a production ready product that can service multiple member types (brewery, affiliate, enthusiast). Allows admnistrative control over all member types and all member activity. Includes more specific features to member only section, and enthuasist sections for public facing website*

**Details**

*Member only Association management system will be able to service specific needs for member only section, including ability to access respository of assets/documents, polling, member forums, custom form development/submission and social media management. Enthusiasts section on public facing website with accompanying features including and not limited to discounts, reward points, and membership management*

## **Phase 3 Overview**
*Phase 3 is rolled out to it's own phase if phase 2 is running behind, which it most likely will (should be planned for). Otherwise, time permitted phase 3 is unnecessary and all relevant features will be integrated into Phase 2.*

**Goal**

*Provide festival platform able to service SF Beer Week and all future festivals. Allows administrative control over all content on festival site. Has support for managing sponsors/partners, attending breweries, beer week events, different types of entertainment, and ticketing platform. Will have metrics.*


**Details**

*Festival platform will  be able to support large festival and adopt smaller subfestivals as special events within a festival such as SF Beer week. Within each optional subfestival and larger accommodating festival will exist db models for attending breweries, different types of entertainment such as food pairings and music, sponsors/partners, and showing different parts of ticket sales to link to ticket platform.*

&nbsp;
&nbsp;
&nbsp;

# Technology Stack

![Merb Stack](https://i.imgur.com/1ySSWos.png)

 - **MongoDB**
	 - URI for mongo shell:
		 - `mongo "mongodb+srv://babg-cluster-0-ounok.mongodb.net/sfbeer-development" --username babg`
	 - Development Database:
		 - `sfbeer-development`
	 - Production Database:
		 - `sfbeer-production`
	 - Web GUI
		 - [https://cloud.mongodb.com/user#/atlas/login](https://cloud.mongodb.com/user#/atlas/login)
	 - Mongoose ODM v5.0.2
 - **Express**
	 - Rest Based API *(JSON)*
	 - MVC architecture
 - **Node**
	 - Web Server handling HTTP/S requests
	 - [Bcrypt-NodeJS](https://github.com/shaneGirish/bcrypt-nodejs) for hashing raw passwords
	 - [Node-Fetch](https://github.com/bitinn/node-fetch) Library to handle 3rd party async calls
	 - Google Maps API for handling geocoding *(via fetch)*
		 - [https://console.cloud.google.com/apis/](https://console.cloud.google.com/apis/)
	 - [AWS](https://github.com/aws/aws-sdk-js) and [Multer](https://github.com/expressjs/multer) for handling image cloud uploads and url references
		 - [https://console.aws.amazon.com/console/home](https://console.aws.amazon.com/console/home)
	 - [Node-Mailer](https://github.com/nodemailer/nodemailer) for handling email transactionsTBD
		 - default email sender *app@sdbeer.com*
	 - *[Stripe](https://github.com/stripe/stripe-node) for handling financial transactions **(TBD/need to add)***
		 - [https://dashboard.stripe.com/login](https://dashboard.stripe.com/login)
	 - 	*[Node-BB](https://github.com/NodeBB/NodeBB) as a discussion forum. Can integrate existing user base **(TBD/need to add)***
 - **Webpack**
	 - Configuration based off of [Create-React -App](https://github.com/facebook/create-react-app)
		 - G-zip compression
		 - Bundle Minification
	 - CRA Service Worker
	 - Scss Compatible
	 - Autoprefixed CSS, so you don't need ```-webkit-``` or other prefixes
 - **React**
	 - [Redux](https://github.com/reduxjs/react-redux)
		 - Rest/CRUD architecture
		 - [Redux Thunk](https://github.com/reduxjs/redux-thunk) for asynchronous actions
		 - [React-Notifications-System-Redux](https://github.com/gor181/react-notification-system-redux) for snackbar notifications
		 - [Redux-Form](https://github.com/erikras/redux-form) for handling forms
			 - [React-Flatpickr](https://github.com/coderhaoxin/react-flatpickr) for handling datetime inputs
			 - [React-Color](https://github.com/casesandberg/react-color) for color picker inputs
			 - [React Quill](https://github.com/zenoamaro/react-quill) for rich text editor *(may need to be updated to avoid dangerouslysetting innerHTML)*
			 - [React-FileStack](https://github.com/filestack/filestack-react) for customizable image uploading
		 - *[React-Form-Builder](https://github.com/blackjk3/react-form-builder) possibly for dynamic form building **(TBD/need to add)***
	 - [React Router v4.2.2](https://github.com/ReactTraining/react-router)
	 - [React-Loadable](https://github.com/jamiebuilds/react-loadable) *for code splitting in members section for admin/member **(need to add)***
	 - *NEEDS SSR for Public Site* (helps seo)
 -  **Foundation Sites**
	 - [Foundation-Sites v6.4.4](https://github.com/zurb/foundation-sites)
	 - [Foundation XY-grid classes](https://foundation.zurb.com/sites/docs/xy-grid.html) for layout


# Schema Design
![schema](https://i.imgur.com/v3xX4fv.png)
fig. 1: Relationships between DB Models. Each model contains relevant fields, and some sample fields.


## **DB Models**

|Model/Collection  | Example |Characteristics| Relationships|
|--|--|--|--|
| **Chapter** | *South Bay Chapter* | Represents one of 5 chapters of the Bay Area Brewers Guild. Other examples are San Francisco, North Bay, East Bay, Monterey/Santa Cruz | Has multiple members that belong to a single chapter. |
|**Member**|*Almanac Beer Co.*| Represents a brewery or affiliate member that is a business with a location/s that serve craft beer| Belongs to a chapter, has multiple locations |
|**Location**|*Alameda Barrel House*|Represents a physical location that end users can visit. Can accomodate events. Will be the main map points brewery map|Belongs to a member, has multiple events|
|**Festival**|*San Francisco Beer Week*|Guild/Chapter Wide Event. Has attending breweries, events, partners, entertainment, and subfestivals| possible belong to chapter |
|**Poll**|*Should the guild vote in a member*|Chapter or guild specific poll with verifiable vote from members. Has optional deadline and optional private/public results| na |
|**Announcement**|*SF Beer Week Event submissions start next week. Get your beer lists in now!*|An announcement that can apply to members in a chapter/guild wide manner. Or just to enthusiast members on a chapter/guild wide level| na |
|**Notification**|*Almanac Brewing has added a new event: Trivia Night at Alameda Barrel House*|A notification that goes into an activity feed. Members will see notifications for new events and locations. Enthusiasts will sign up to see notifications for specific breweries/chapters/guild wide| na |
&nbsp;


## **User Model/Collection**

| User Type | Description | Possible Permissions |
|--|--|--|
| **Master Administrator** *'master'*| Designated for director of Bay Area Brewers Guild and Developers, can build create/edit/delete content on the public site | ***ALL*** |
| **Chapter Administrator** *'chapter'* | Designated for members of the Bay Area Brewers Guild or existing brewery members. Will be able to create chapter specific polls, create/edit/delete members of chapters,and edit chapter relevant information. Can create/edit/delete content on the chapter relevant site. Assumes presence of ***chapterId*** field in user object | ***All chapter level rights*** |
| **Permission Specific Administrator**  *'agent'* | Designated for any individual to access specific applications/tools within the platform. Can restrict to particular chapter with presence of ***chapterId***  field | crud guild/chapter blog posts, crud festival information,   |
| **Brewery/Affiliate Administrator** *'member'* | Can edit things related to a particular brewery / affiliate member.  Can create events, edit existing brewery information, vote in chapter/guild wide polls, manage membership subscription, all based on available permissions | create/edit events, vote, edit information, cancel/change payment type for subscription |
| **Enthusiast** *'enthusiast'* | Designated for end users. Will be able to bookmark favorite breweries and other enthusiast related features | none |

![Schema](https://i.imgur.com/1UI6vyf.png)




# Members Portal User Stories
*Stories are organized by user type, feature, phase, and sprint #*
**List is subject to changes*

## Phase 1
|As a\n| I'd like to  | Sprint | Assignment|
|--|--|--|--|
| **Master Admin** | --- | 1 |
| - | log into the members portal | 1 |
| - | crud* master *(with secret pass)*, chapter, agent members |1 |
| - | crud* chapters |1 |
| - | crud* brewery/affiliate members with links to chapter |1 |
| - | assign brewery an ABC license type |1 |
| - | add extra fields to brewery members  |1 |
| - | hide/un-hide brewery member from all feeds |1 |
| - | move one member from one chapter to another |1 |
| - | crud member's locations |1 |
| - | crud member's location's events | 1 |
| - | see members by chapter | 1 |
| - | revert member's locations' events to previous version | 1 |
| - | send email invite to initiate link for user to brewery member |2 |Ross|
| - | set permissions for particular brewery member user |2 | Ross |
| - | set permissions for brewery to allow voting, forum access for brewery in general |2 | Ross |
| - | set an event as featured, marquee, and chapter marquee | 2 | Ross|
| - | see a list of features/marquee/chapter marquee events | 2 |Ross|
| - | crud different types of subscriptions with relevant tag for members | 3 |Ross|
| - | get notified if a member's subscription payment is overdue | 3 |Ross|
| - | issue discount code or just discount to a member's subscription | 3 |Ross|
| - | automatically send payment reminder to members that are overdue | 3 | Ross |
| - | manually send payment reminder to members that are overdue | 3 |Ross|
| - | create a single invoice for any occasion with relevant tag - *accomodates sponsors and one off payments* | 3 |Ross|
| - | See a list of all invoices made, and the status of the invoices. *filterable* | 3 |Ross|
| - | assign a single subscription to a particular member | 3 |Ross|
| - | change a members subscription and notify member | 3 | Ross|
| - | offer discount for member's subscription | 3 | Ross |
| **Chapter Admin** | --- | sprint |
| - | log into the members portal | 1 |
| - | edit chapter information |1 |
| - | crud location/event/member only for the chapter |1 |
| - | do all relevant master admin functions within chapter | # |
| - | see a list of chapter specific marquee/features events | 2 |Ross|
| - | modify subscription for any chapter member | 3 |
| **Brewery/Affiliate Member** | --- |sprint |
| - | log into the members portal |1 |
| - | change my password |1 |
| - | update member information, logo etc. . |1 |
| - | crud locations/events |1 |
| - | reset my password via email *(lost pass)* |1 |
| - | revert member's locations' events to previous version | 1 |
| - | see list of all users *(employees)* for current brewery member |2 |Ross|
| - | invite new member and set their permissions |2 | Ross|
| - | cancel subscription | 3 |
| - | change payment source for subscription | 3 |
| -| sign up/cancel subscription|3 |
| - | automatically get payment reminder if subscription is overdue | 3 |
| -| change payment information| 3 |


## Phase 2


|As a\n| I'd like to | Sprint # |
|--|--|--|
| **Master Admin** | --- |sprint |
| - | create chapter/guild wide poll |# |
| - | see guild activity for all resources updates/deletions/additions |# |
| - | see list of all items in document repository |# |
| - | add, delete, edit, hide item in document repository |# |
| - | see a list of all Enthusiast Members |# |
| - | create/delete/edit Enthusiast Members |# |
| - | see all metrics for all resources** |# |
| - | create a custom form and have a place to see all it's results** |# |
| - | specify if the results of the custom form are public/private |# |
| - | create optional deadline for any custom form |# |
| - | create a special page just for the form (private or public) |# |
| - | see metrics for subscription information |# |
| - | download assets for a particular brewery |# |
| - | send email out to all enthusiasts, or chapter specific enthusiasts |# |
| - | crud announcements for all members or specific chapter members |# |
| - | crud announcements for all enthusiasts/chapter enthusiasts |# |
| - | export list of breweries/locations/events to csv and formatted |# |
| - | export metrics report for month |# |
| **Chapter Admin** | --- |sprint |
| - | create chapter wide poll |# |
| - | see guild activity for chapter resources** updates/deletions/additions |# |
| - | crud announcements for all chapter enthusiasts |# |
| - | crud announcements for chapter members |# |
| - | send email out to chapter specific enthusiasts |# |
| **Brewery/Affiliate Member**| ---|sprint |
| - | see list of announcements for chapter/guild |# |
| - | see/download list of documents from the doc repository |# |
| - | vote on chapter and guild wide polls |# |
| - | fill out a custom form and see my results |# |
| - | change contents of form if it has a deadline and it's before |# |
| - | see results of form if allowed by administrator |# |
| - | have access to to guild/chapter forum *(with permissions read, write, delete forum posts)* |# |
| - | see guild activity for additions to all resources |# |

**crud is  **C**reate, **R**ead, **U**pdate, and **D**elete*
***resource refers to any specific DB model*


# Public Site User Stories

## Phase 1

|As a\n| I'd like to | Sprint # |
|--|--|--|
| **Master Admin** | --- | **sprint** |
| - | crud a page picking from multiple pre-made sections to the ***guild*** site  | 4 |
| - | crud a page picking from multiple pre-made sections to any ***chapter*** site  | 4 |
| - | add header link for any page| 4 |
| - | create a blog post| 4 |
| - | hide/un-hide chapter specific website | 4 |
| - | specify subdomain/custom URL for chapter specific website |4 |
| **Chapter Admin** |  | **sprint** |
| - | crud a page picking from multiple pre-made sections to any ***chapter*** site  | 4 |
| - | create blog post for chapter  | 4 |
| **End User** |  | # |
| - | visit guild site, and/or relevant chapter site  | 5 |
| - | see filterable events for guild site/chapter site  | 5 |
| - | see event details  | 5 |
| - | see filterable breweries for guild site/chapter site  |5 |
| - | see brewery profile  | 5 |
| - | see filterable map of locations for guild site/chapter site  | 5 |
| - | see location details  | 5 |
| - | see filterable blog posts for chapter/guild  | 5 |
| - | see additional pages made by administrators  | 5 |
| - | contact the guild through form  | 5 |

## Phase 2
|As a\n| I'd like to | Sprint  |
|--|--|--|
| **Enthusiast Member**| ---|# |
| - | sign up to be an enthusiast member |# |
| - | change my password |# |
| - | reset my password *(lost pass)* |# |
| - | deactivate my account |# |
| - | bookmark a brewery and sign up for emails or text messages for events at that brewery|# |
| - | see list of bookmarked breweries|# |
| - | see activity feed of bookmarked breweries *new locations and new events|# |
| - | sign up for a specific chapter, and see chapter relevant activity *(ie chapter specific announcements)*|# |


# Festival Platform User Stories

*Will accommodate SF Beer week and all subsequent big festivals/events for the guild/chapters. These user stories will touch both the members portal and the public site. Will most likely require configuring a separate domain for SEO purposes.*

*Festivals can either be on the guild level or the chapter level. If festival instance exists on chapter level, it will be editable by chapter administrators and master administrators alike. However if the festival lives on the guild level (sf beer week) then it will only be maintainable from a master administrative role.*
## Phase 3

|As a\n| I'd like to | Sprint # |
|--|--|--|
| **Master/Chapter Admin** | --- | sprint |
| - | initiate a new festival |# |
| - | hide festival/delete festival |# |
| - | accept submissions for events and approve events |# |
| - | automatically charge event submissions $X |# |
| - | approve or deny events and refund accordingly |# |
| - | crud pages for the festival public-site |# |
| - | manage events, partners, entertainment, ticket marketing, subfestivals, and attending breweries |# |
| - | manage ticketing through 3rd party platform? |# |
| **End User** | --- | sprint |
| - | See a map of all events for festival |# |
| - | See landing page for sf beer week |# |
| - | Learn more about the guild in about page |# |
| - | submit request to post event on events feed |# |
| - | See ticketing and partners |# |
| - | See entertainment, and attending breweries |# |
| - | see subfestivals and their detailed pages |# |

# File Structure
## Base
    .
    ├── server.js        # Entry point for application
    ├── src              # Source files for react front-end
    ├── server           # Source files for node back-end
    ├── public           # Contains source index.html file that is used during npm run build
    ├── config           # Webpack configuration files from CRA & Mongodb Server URI/DB name
    ├── scripts          # npm scripts from CRA (create-react-app)
    ├── build            # Compiled files made each time npm run build is executed
    ├── schema.xml       # raw file for schema illustration
    ├── package.json     # list of dependencies
    ├── nodemon.json     # configuration for nodemon. used with npm run serve
    └── README.md

**```server.js```**

Acts as the entry point for the entire application/platform running node/nodemon on server.js will start up the web server and accept http requests. Hitting the web server with any url not specified under ``` ./server/routes.js ``` will return react bundle

**```package.json```**

All dependencies can be found inside package.json. Also contains npm scripts for production/development. Also contains rules for linting. This project uses [airbnb  linting rules](https://github.com/airbnb/javascript).

## Backend File Structure
**```./server```**

Contains all files related to the backend. Uses express for api routing, and uses mongoDB for persistent state. Follows [MVC architecture](#https://developer.mozilla.org/en-US/Apps/Fundamentals/Modern_web_app_architecture/MVC_architecture). View in this case is the entire ```./src``` folder outside of this folder.

    ./server
    ├── routes.js        # list of routes for fetching JSON data. Loosely follows REST
    ├── middleware.js    # Express functions to be run for every request that comes in. Formats incoming http requests.
    ├── controllers      # list of routes for fetching JSON data. Loosely follows REST
        ├── default      # folder that contains default functions for controllers
		    ├── crud.js      # default crud behavior for every db model that is specified
    ├── models           # mongoose models that follow the schema design
    ├── services         # 3rd party services such as stripe/nodemailer/google maps for outside help. Follow controller format to connect to routes
    ├── helpers          # functions that are re-used in multiple places. this is their home.
    ├── refs             # look up tables/lists that are static.
    ├── modules          # standalone features that don't warrant full db model support or controller support

**Default crud behavior is meant to faciliate easier start ups. Applying default crud method wrapper onto controllers gives each db model an **index** (read all), **create**, **show** (read one), **update**, and **destroy** method. Most likely each individual method will be replaced with  more specific functionality down the line.*

## Frontend File Structure
**```./src```**
Contains all files related to front end react application.

    ./src
    ├── assets                    # logos and other static media assets
    ├── components                # all react components that are imported into index.jsx
        ├── common                # any component that would be used in more than one page/resource would be defined here. ex: /modal/modal.jsx
        ├── pages                 # each individual component in here should map to a specific URL. Page components are considered smart container. All fetching and data handling should be done through these components
        ├── resources             # dummy components that are related to specific DB models/resources. Standard functionality has listItem, list, form, details, and nav.
        ├── app.jsx               # Routes are imported here and configured here into the application.
        ├── bundle.scss           # all scss files should branch out from here. The mother of all scss files within /components folder
    ├── helpers                   # functions that are re-used in multiple places
        ├── fetchApi.js           # native fetch abstraction layer. Should simplify fetch calling. Can be used as callback or promise
    ├── redux                     # configuration for implementing redux. reducers are split into DB models/resources
	    ├── initialState.js       # shows initial state for branches of redux store. contains crudstate function which applies default state to each resource.
	    ├── actions               # contains all actions  which should map to its index.js
	        ├── index.js          # all actions are exported from this indexjs
	        ├── default           # default behavior for DB models
	            ├── crudAction.js # smoshposh of unreadable closures to make async thunk actions that relate to specific routes easy to use. It strictly maps CRUD behavior to one specific DB model.
	        ├── asyncAction.js    # general usage async actions. To use this you would have to create a relevant reducer to grab async action result
	    ├── reducers              # list of all reducers for each resource
	        ├── index.js          # where all reducers are imported. combineReducers config occurs here.
    ├── refs                      # look up tables/lists that are static
    ├── styling                   # SCSS files and rules
	    ├── settings.scss         # General rules for all styling. Main color pallete hex values stored here.
	    ├── mixins.scss           # where mixins are defined for scss
    ├── index.jsx                 # entry point for frontend
    ├── registerServiceWorker.js  # CRA configuration for registering offline service worker. Executes inside index.jsx


# Configuring the API Keys and Services

The following services and their associated API keys (if required) must be configured in the following files:

## MongoDB

* [`./.env`](./.env) -- Specify the MongoDB URI in `MONGO_URI` (the URI should begin with `mongodb://`). You can find the database's URI by going into [MongoDB Atlas](https://cloud.mongodb.com), then selecting the cluster (e.g., `babg-cluster-0`), then selecting "Command Line Tools". Click on the "Connect Instructions" button in the "Connect To Your Cluster" section, then select "Connect Your Application" in step 3. Select "Standard connection string (3.4+ driver)" and copy and paste the URI into `MONGO_URI`. Additionally, replace `<PASSWORD>` with the MongoDB user password.

> **Note**  
> If on Heroku, the `MONGO_URI` must also be changed within the app's config vars (accessible by going into the app's settings on Heroku's dashboard).

## Stripe

* [`./.env`](./.env) -- Specify the Stripe secret key in `STRIPE_TEST_SECRET` (the key should begin with `sk_...`) and the Stripe product ID in `STRIPE_PRODUCT` (the key should begin with `prod_...`).

> **Note**  
> If on Heroku, the `STRIPE_TEST_SECRET` and `STRIPE_PRODUCT` must also be changed within the app's config vars. See the note above in the `MongoDB` section.

## Google

* [`./server/services/google/index.js`](./server/services/google/index.js) -- Specify the Google API key in `googleApiKey`. The Google Maps Places API must be enabled in the API console. **This is currently not filled in, resulting in some features appearing broken.**

## FileStack

* [`./src/components/common/form/inputs/fileStackField.jsx`](./src/components/common/form/inputs/fileStackField.jsx) -- Specify the FileStack API key in `fileStackApiKey`.

## Untappd

* [`./src/components/resources/members/details/untappd/untappdInfo.jsx`](./src/components/resources/members/details/untappd/untappdInfo.jsx) -- Specify the Untappd client ID in `untappdClientId` and the secret key in `untappdClientSecret`.
* [`./src/components/resources/members/details/untappd/untappdSearch.jsx`](./src/components/resources/members/details/untappd/untappdSearch.jsx) -- Specify the Untappd client ID in `untappdClientId` and the secret key in `untappdClientSecret`.

# Running the Application

## Running Development Server
To run application in development, you must run the node server on port 3001 and the react bundle on port 3000. To do so, npm scripts defined in ```package.json``` are configured to do so.

**To Run On Localhost**
```
$ npm run dev
```
> npm run dev will run webpack-dev-server and provide the react front-end on port 3000.
```
$ npm run serve
```
> npm run serve will run nodemon and provide the node back-end on port 3001

**Execute these lines on two separate terminals. See package.json npm scripts to see where these are defined*

## Heroku Deployment
For best experience, download heroku CLI.
### 1 . Download Heroku
```
$ brew install heroku/brew/heroku
```
or
```
$ curl https://cli-assets.heroku.com/install.sh | sh
```

### 2.  Login to Heroku
```
$ heroku login
```
### 3.  Add as Remote

```
$ heroku git:remote add sfbeer-members
```

### 4.  Push to remote
```
$ git push heroku master
```
**Typically you won't be pushing directly. Best work flow will involve a heroku pipeline with a staging branch that will reflect master. Once a change has been implemented to the repository (master being updated), a developer/QA will check successful changes and promote staging branch to production branch*

# Wire Frame
[Interactive Wire Frame](https://wireframe.cc/pro/pp/5b18eeab2178587)

# Mile Stones
### Phase 1
- Manage top level master admin functions - Sprint #1
- Manage brewery members and their locations/events - Sprint #1
- Manage permissions for members and members' users - Sprint #2
- Manage brewery member subscriptions - Sprint #3
- Manage custom invoices -Sprint #3
- Manage public-site CMS for guild
- Manage public-site CMS for chapter
- Public-Site
	- View Breweries/beer profile
	- View Events/event details
	- View Map/location details
	- Extra features *(ie. contact form & etc...)*
	- Styled

### Phase 2
- Manage metrics
- Manage custom forms
- Manage polls/doc repository
- Manage announcements/notifications
- Manage forum
- Manage Enthusiast members
- Enthusiast member features

# Tentative Sprint Schedule

## Sprint #1
**Time Frame:**  *07/09/18 - 07/13/18*
**Requirements:** Stripped and operational MERN Framework
**Deliverables:**
- Top level admin features.
- Create/edit/delete of events, locations, breweries from master, chapter, member level
- Implement version control for events

## Sprint #2
**Time Frame:**  *07/16/18 - 07/20/18*
**Requirements:** Deliverables from **sprint #1** (event version control optional)
**Deliverables:**
- Permission Based features.
- Managing users from master, chapter, and member level.

## Sprint #3
**Time Frame:**  *07/23/18 - 08/3/18*
**Requirements:** Deliverables from **sprint #1**, and all **sprint #2** deliverables.
**Deliverables:**
- Subscription based feature for members
- Manage subscriptions from master, chapter, and member level

## Sprint #4
**Time Frame:**  *08/06/18 - 08/15/18*
**Requirements:** Deliverables from **sprint #2**, >>>>>***basic brand guidelines*** <<<<<
**Deliverables:**
- CMS backend for guild/chapters public-site. Should be located on members portal
- Create and manage pages for the public site.

## Sprint #5
**Time Frame:**  *08/16/18 - 08/24/18*
**Requirements:** Deliverables from **sprint #2** and **sprint #4**, >>>>***full brand guidelines***<<<<
**Deliverables:**
- Events feed, locations map, brewery directory, and other extra pages
- Main front end components for users on guild/chapter public sites.


## Considersations for planning sprints
- how to deal with sprints when they are running behind
	- back log the feature and keep going?
		- is this feature completely necessary?
	- change the next sprint to accomodate missed feature?
		- is there a smart compromise to release the feature in a functional capacity without bells and whistles to save time?
	- all depends on the feature, timeline, and other factors




# Database Models Reference
## Notifications
```javascript
const NotificationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['brewery','event','location', 'festival'],
  },
  tag: {
    type: String,
    required: true,
    enum: ['modified', 'new', 'deactivated', 'issue', 'other'],
  },
  body: { type: String, required: true },
  title: { type: String, required: true },
  itemId: { type: String, required: true },
  chapterId: { type: String, required: true },
  image: { type: String },
  created: { type:Number, default: Date.now() }
});
```

```javascript
const AnnouncementSchema = new Schema({
  tag: { type: String },
  body: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  chapterUuid: { type: String }, // presence will restrict to that chapter
  audience: {
    type: String,
    required: true,
    enum: ['members', 'enthusiasts'],
  },
  created: { type: Number, default: Date.now }
})
```


&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;

Different Statuses for Members
```javascript
status: {
  enum: ["active", ""]
},
subscriptionsStatus: {
	enum: ['active', 'unpaid', ''], // may depend on stripe
}
```


# Extra-considerations

## Enthusiast Members
*Any end user will be able to visit public site and sign up to be an enthusiast member. Once signed up, the member will be able to sign up to be an enthusiast. Then they can choose to sign up to any particular chapter (each enthusiast will have an array of chapter ID's)*

## Featured Events
*Event Model will have field **chapterFeatured** which is an array of chapter which it is featured in, will also have marquee for general guild*

## Metrics
**For public site**
- user looking at one specific event
- user looking at one specific location
- user looking at one specific brewery
- user loading website
- user looking at any individual page
- user looking at one specific chapter page
- looking events over time

**For Member Portal**
- looking at any resource
- loading portal
-  

## General To Do
1. define all possible permissions
2. choose forum platform (node BB?)
~~3. choose ticket platform~~ (ticketsauce is chosen)
4. define attributes of chapter site
5. wire frame
6. fill out known fields for models


## Technical To Do

1.  Take sdbeer2
2.  Strip all db models
3.  Strip all controllers
4.   Strip all routes
5.   Comment out all uneeded services
6.   Delete all pages but home
7.   Delete all resources
8.   Re do the form container
9.   Delete all common except loading/modal maybe
10.   See about turning auth into HOC
11.   Create basic auth wireframe for member portal
12.   Design file structure
13.   Pages,
14.   Resources
15.   Code splitting
16.   Incorporate visual builder
17.   Redux Notification System with Redux Form

<!--stackedit_data:
eyJoaXN0b3J5IjpbLTUxNzY5ODUwMiw2ODQ2MjE4MjQsLTY2OD
c3MjI4NSwtMjEyMDk5NzIxMSw2Njc2MTU4MzAsLTE0OTg0NzIx
NDAsNTA0MTM2NDM3LC0xMzg5NzIyNDcyLC0xNjg0OTMwMTU4LC
0xNzQ5MTE0NTEzLDEzMDg1NTYzNzUsMTk3OTgwOTk3NywtOTk5
NTkxNDgzLC0xMzA1NjE3NjM0LC01NjE5Njg1MjEsLTYyNDQ5Mj
IyMCw2NjYyMDk0MjYsNDQwMTE3MzQyLC0xNDg3NTMxMDY2LC0x
Mzk1NzM4NTQ3XX0=
-->

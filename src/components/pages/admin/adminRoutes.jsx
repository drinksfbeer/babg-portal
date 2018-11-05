import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DashboardContainer from '../admin/dashboard/adminDashboardContainer';
import ChaptersContainer from '../admin/chapters/chaptersContainer';
import ChapterDetailsContainer from '../admin/chapterDetails/chapterDetailsContainer';
import GuildActivityContainer from '../admin/guildActivity/adminGuildActivityContainer';
import GuildSubscriptions from '../admin/subscriptions/adminSubscriptionsContainer';
import GuildInvoices from './invoices/adminInvoicesContainer';
import MemberDetailsContainer from '../admin/memberDetails/adminMemberDetailsContainer';
import LocationDetailsContainer from '../admin/locationDetails/adminLocationDetailsContainer';
import PagesContainer from '../admin/pages/adminPagesContainer';
import EventDetailsContainer from '../admin/eventDetails/adminEventDetailsContainer';
import PageDetailsContainer from '../admin/pageDetails/adminPageDetailsContainer';
import SFBWPageDetailsContainer from '../../pages/admin/SFBW/pageBuilder/SFBWPageBuilder';
import SettingsContainer from '../admin/settings/adminSettingsContainer';
import FormDetailsContainer from '../admin/formDetails/adminFormDetailsContainer';
import AccountsContainer from './accounts/adminAccountsContainer';
import BlogPostsContainer from './blogPosts/adminBlogPostsContainer';
import BlogPostDetailsContainer from './blogPostDetails/adminBlogPostDetailsContainer';
import SFBWpagesContainer from './SFBW/SFBWpagesContainer';
import SFBWsponsorsContainer from './SFBW/sponsors/SFBWsponsors';
import SFBWeventsContainer from './SFBW/agentEvents/agentEventsContainer';
import SFBWeventsDetails from './SFBW/agentEvents/agentEventsDetailsContainer';
import Four04 from '../../common/404/404';

const Routes = (
  <Switch>
    <Route
      path="/dashboard"
      component={DashboardContainer}
    />
    <Route
      path="/guild"
      component={GuildActivityContainer}
    />
    <Route
      path="/subscriptions"
      component={GuildSubscriptions}
    />
    <Route
      path="/invoices"
      component={GuildInvoices}
    />
    <Route
      path="/member/:id"
      component={MemberDetailsContainer}
    />
    <Route
      path="/location/:id"
      component={LocationDetailsContainer}
    />
    <Route
      path="/event/:id"
      component={EventDetailsContainer}
    />
    <Route
      exact
      path="/chapters"
      component={ChaptersContainer}
    />
    <Route
      exact
      path="/chapters/new"
      component={ChaptersContainer}
    />
    <Route
      path="/chapters/:slug"
      component={ChapterDetailsContainer}
    />
    <Route
      path="/page/:id"
      component={PageDetailsContainer}
    />
    <Route
      path="/sfbw/page/:id"
      component={SFBWPageDetailsContainer}
    />
    <Route
      path="/blogPost/:id"
      component={BlogPostDetailsContainer}
    />
    <Route
      path="/form/:id"
      component={FormDetailsContainer}
    />
    <Route
      path="/site"
      component={PagesContainer}
    />
    <Route
      path="/accounts"
      component={AccountsContainer}
    />
    <Route
      path="/account/:id"
      component={AccountsContainer}
    />
    <Route
      path="/subscriptions"
      component={GuildSubscriptions}
    />
    <Route
      path="/blog"
      component={BlogPostsContainer}
    />
    <Route
      path="/sfbw/site"
      component={SFBWpagesContainer}
    />
    <Route
      path="/sfbw/sponsors"
      component={SFBWsponsorsContainer}
    />
    <Route
      path="/sfbw/sponsors/:page"
      component={SFBWsponsorsContainer}
    />
    <Route
      path="/sfbw/events"
      component={SFBWeventsContainer}
    />
    <Route
      path="/sfbw/event/:id"
      component={SFBWeventsDetails}
    />
    <Route
      path="/settings"
      component={SettingsContainer}
    />
    <Route component={Four04} />
  </Switch>
);

export default Routes;

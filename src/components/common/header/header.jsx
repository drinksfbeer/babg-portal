import { connect } from 'react-redux';
import { withRouter, Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccountItem from './account/accountItem';
import HeaderItem from './item/headerItem';

// assumed to be a component prop for Route component (to pass down route params)

class Header extends React.Component {
  constructor(props) {
    super(props);

    const initialPathnames = props.location.pathname.split('/');
    const initialKey = initialPathnames[1] === 'chapters' ? // eslint-disable-line no-nested-ternary
      `chapter-${initialPathnames[3] || ''}` :
      (initialPathnames[1] === 'sfbw' ? `sfbw-${initialPathnames[2]}` : initialPathnames[1]);

    this.state = {
      active: false,
      toggledItems: {
        [initialKey]: true,
      }, // whether `subItems` are visible in each header item
    };
  }

  render() {
    const {
      match: {
        params: {
          slug,
        },
      },
      location: {
        pathname,
      },
      user,
      chapters,
      location,
      toggleActive,
    } = this.props;
    const { active, toggledItems } = this.state;

    const loggedIn = !!user;
    const master = loggedIn && user.role === 'master';
    const chapter = loggedIn && user.role === 'chapter';
    const member = loggedIn && user.member && user.role !== 'master';
    const agent = loggedIn && user.role === 'agent';
    const canSubmitEvents = agent && user.permissions.includes('submit_events');
    const isSFBW = pathname.includes('/sfbw');
    const currentChapter = master ?
      (slug && chapters.find(chap => chap.slug === slug)) :
      (user && user.chapterUuid && chapters.find(chap => chap.uuid === user.chapterUuid));

    const masterHeaderItems = [{
      active: loggedIn,
      to: '/dashboard',
      icon: 'dashboard',
      title: 'Dashboard',
    }, {
      active: master,
      to: '/guild',
      icon: 'explore',
      title: 'Activity',
      subItems: [{
        title: 'Notifications',
        to: '/guild/activity',
        icon: 'notifications',
      }, {
        title: 'Announcements',
        to: '/guild/announcements',
        icon: 'announcement',
      }, {
        title: 'Events',
        to: '/guild/events',
        icon: 'event',
      }, {
        title: 'Members Directory',
        to: '/guild/members',
        icon: 'group',
      }, {
        title: 'Forms',
        to: '/guild/forms',
        icon: 'assignment',
      }],
    }, {
      active: master,
      to: '/chapters',
      icon: 'account_balance',
      title: 'Chapters',
      subItems: chapters.map(chap => ({
        title: chap.name,
        to: `/chapters/${chap.slug}`,
        icon: chap.icon,
      })),
    },
    {
      active: master,
      to: '/accounts',
      icon: 'account_circle',
      title: 'User Accounts',
      subItems: [{
        title: 'Create New',
        to: '/accounts/new',
        icon: 'person_add',
      }],
    }, {
      active: master,
      to: '/subscriptions',
      icon: 'autorenew',
      title: 'Subscriptions',
      subItems: [{
        title: 'Plans',
        to: '/subscriptions/plans',
        icon: 'assignment',
      }, {
        title: 'Coupons',
        to: '/subscriptions/coupons',
        icon: 'card_giftcard',
      }],
    }, {
      active: master,
      to: '/invoices',
      icon: 'attach_money',
      title: 'Invoices',
      subItems: [{
        title: 'Create New',
        to: '/invoices/new',
        icon: 'note_add',
      }],
    }, {
      active: master,
      to: '/site',
      icon: 'web',
      title: 'Website Pages',
      subItems: [{
        title: 'Create New Page',
        to: '/site/new',
        icon: 'note_add',
      }, {
        title: 'Site Header',
        to: '/site/header',
        icon: 'power_input',
      }],
    }, {
      active: master,
      to: '/blog',
      icon: 'sms',
      title: 'Blog',
      subItems: [{
        title: 'Create New Post',
        to: '/blog/new',
        icon: 'note_add',
      }],
    }, {
      active: master,
      to: '/sfbw/events',
      icon: 'location_city',
      title: 'SF Beer Week',
    }, {
      active: master,
      to: '/settings',
      icon: 'settings',
      title: 'Settings',
      subItems: [{
        title: 'Profile',
        to: '/settings',
        icon: 'recent_actors',
        exact: true,
      }, {
        title: 'Portal',
        to: '/settings/portal',
        icon: 'developer_board',
      }, {
        title: 'Festival Events',
        to: '/settings/festival',
        icon: 'date_range',
      }],
    }];

    const chapterHeaderItems = currentChapter ? [{
      active: loggedIn,
      to: `/chapters/${currentChapter.slug}`,
      icon: 'dashboard',
      title: 'Dashboard',
      exact: true,
    }, {
      active: loggedIn,
      to: `/chapters/${currentChapter.slug}/activity`,
      icon: 'explore',
      title: 'Activity',
      subItems: [{
        title: 'Notifications',
        to: `/chapters/${currentChapter.slug}/activity`,
        icon: 'notifications',
      }, {
        title: 'Announcements',
        to: `/chapters/${currentChapter.slug}/activity/announcements`,
        icon: 'announcement',
      }, {
        title: 'Events',
        to: `/chapters/${currentChapter.slug}/activity/events`,
        icon: 'event',
      }, {
        title: 'Members Directory',
        to: `/chapters/${currentChapter.slug}/activity/members`,
        icon: 'group',
      }],
    }, {
      active: loggedIn,
      to: `/chapters/${currentChapter.slug}/site`,
      icon: 'web',
      title: 'Website Pages',
      subItems: [{
        title: 'Create New Page',
        to: `/chapters/${currentChapter.slug}/site/new`,
        icon: 'note_add',
      }],
    }, {
      active: loggedIn,
      to: `/chapters/${currentChapter.slug}/blog`,
      icon: 'view_stream',
      title: 'Blog',
      subItems: [{
        title: 'Create New Post',
        to: `/chapters/${currentChapter.slug}/blog/new`,
        icon: 'note_add',
      }],
    }, {
      active: loggedIn && chapter,
      to: '/accounts',
      icon: 'account_circle',
      title: 'User Accounts',
      subItems: [{
        title: 'Create New',
        to: '/accounts/new',
        icon: 'person_add',
      }],
    }, {
      active: loggedIn && chapter,
      to: '/subscriptions',
      icon: 'autorenew',
      title: 'Subscriptions',
    }, {
      active: loggedIn,
      to: `/chapters/${currentChapter.slug}/settings`,
      icon: 'settings',
      title: 'Settings',
    }] : [];

    const memberHeaderItems = [{
      active: loggedIn,
      title: 'Dashboard',
      icon: 'dashboard',
      to: '/dashboard',
      exact: true,
    }, {
      active: loggedIn,
      title: 'Activity',
      icon: 'explore',
      to: '/guild',
      subItems: [{
        title: 'Notifications',
        to: '/guild/activity',
        icon: 'notifications',
      }, {
        title: 'Announcements',
        to: '/guild/activity/announcements',
        icon: 'announcement',
      }, {
        title: 'Upcoming Events',
        to: '/guild/activity/events',
        icon: 'event',
      }, {
        title: 'Members Directory',
        to: '/guild/activity/members',
        icon: 'group',
      }],
    }, {
      active: loggedIn,
      title: 'Events',
      icon: 'event',
      to: '/events',
      subItems: [{
        title: 'Upcoming',
        to: '/events/upcoming',
        icon: 'today',
      }, {
        title: 'Past',
        to: '/events/past',
        icon: 'schedule',
      }, {
        title: 'Create New',
        to: '/events/new',
        icon: 'event_available',
      }],
    }, {
      active: loggedIn,
      title: 'Locations',
      icon: 'edit_location',
      to: '/locations',
      subItems: [{
        title: 'Create New',
        to: '/locations/new',
        icon: 'add_location',
      }],
    }, {
      active: loggedIn,
      title: 'User Accounts',
      icon: 'account_circle',
      to: '/accounts',
      subItems: [{
        title: 'Create New',
        to: '/accounts/new',
        icon: 'person_add',
      }],
    }, {
      active: loggedIn,
      title: 'Settings',
      icon: 'settings',
      to: '/settings',
      subItems: [{
        title: 'Profile',
        to: '/settings',
        icon: 'recent_actors',
      }, {
        title: 'Billing',
        to: '/settings/billing',
        icon: 'credit_card',
      }],
    }];

    const sfbwItems = [{
      active: master,
      to: '/sfbw/site',
      icon: 'web',
      title: 'Website',
      subItems: [{
        title: 'View All Pages',
        to: '/sfbw/site',
        icon: 'remove_red_eye',
        exact: true,
      }, {
        title: 'Create New Page',
        to: '/sfbw/site/new',
        icon: 'note_add',
      }],
    }, {
      active: master,
      to: '/sfbw/sponsors',
      icon: 'attach_money',
      title: 'Sponsors',
      subItems: [{
        title: 'View Sponsors',
        to: '/sfbw/sponsors',
        icon: 'remove_red_eye',
        exact: true,
      }, {
        title: 'Add Sponsor',
        to: '/sfbw/sponsors/new',
        icon: 'note_add',
      }],
    }, {
      active: master,
      to: '/sfbw/events',
      icon: 'event',
      title: 'Events',
    }];

    const agentHeaderItems = [{
      active: loggedIn && canSubmitEvents,
      title: 'Your Events',
      to: '/sfbw/events',
      icon: 'calendar-alt',
      subItems: [{
        title: 'View My Events',
        to: '/sfbw/events',
        icon: 'remove_red_eye',
        exact: true,
      }, {
        title: 'Submit Event',
        to: '/sfbw/events/new',
        icon: 'add_circle_outline',
      }],
    }, {
      active: loggedIn,
      title: 'Payment',
      to: '/sfbw/payment',
      icon: 'payment',
    }];

    // const headerItems = (master || chapter) ? chapterOrMaster : memberHeaderItems;
    // const headerItems = master ? // eslint-disable-line
    //   chapterOrMaster : (chapter ? chapterHeaderItems : memberHeaderItems);
    let headerItems = [];
    // console.log('typeof currentChapter:', typeof currentChapter, 'headerItems:', headerItems);
    if (master) headerItems = currentChapter ? chapterHeaderItems : masterHeaderItems;
    if (master && location.pathname.includes('/sfbw')) headerItems = sfbwItems;
    if (chapter) headerItems = chapterHeaderItems;
    if (member) headerItems = memberHeaderItems;
    if (agent) headerItems = agentHeaderItems;

    return (
      <div>
        <div
          className="header-hamburger"
          onClick={() => {
            this.setState({ active: !this.state.active });
            toggleActive({ active: !this.state.active });
          }}
        >
          &equiv;
        </div>
        <div className={`header-container ${active ? 'headerActive' : ''}`}>
          <div className="header-inside">
            <div className="top-all">
              {
                ((currentChapter && master) || (master && isSFBW)) &&
                <NavLink
                  className="back-button"
                  to="/"
                >
                  <i className="material-icons">
                    arrow_back_ios
                  </i>
                  <span>Back To Guild Dash</span>
                </NavLink>
              }
              {/* this
              will change according to the URL Param for chapters not the user's chapter */}
              {/* {currentChapter &&
                <div>
                <Link
                to={`/chapters/${currentChapter.slug}`}
                alt="SF BEER"
                className="header-title"
                >
                {`${currentChapter.name} Chapter`}
                </Link>
                {master &&
                <Link to="/dashboard" >
                <i className="material-icons">
                chevron_left
                </i>
                <span>
                Back
                </span>
                </Link>
                }
                </div>
              } */}
              {
                currentChapter &&
                <Link
                  to={`/chapters/${currentChapter.slug}`}
                  alt="SF BEER"
                  className="chapter-header"
                  style={{ backgroundColor: `${currentChapter.color}` }}
                >
                  <FontAwesomeIcon icon={currentChapter.icon} />
                  {currentChapter.name}
                </Link>
              }
              <nav className="header-nav">
                <ul>
                  {/* {(currentChapter || chapter) ? (
                    <li className="nav-description">Chapter Nav</li>
                    ) : (
                    <li className="nav-description">Guild Nav</li>
                  )} */}
                  {(currentChapter || chapter) ? (
                    <li className="nav-description">
                      Chapter Menu
                    </li>
                  ) : (
                    master &&
                    <li className="nav-description">
                      {isSFBW ? 'SFBW Menu' : 'Guild Menu'}
                    </li>
                  )}
                  {
                    ((member && !master) || agent) &&
                    <li className="nav-description">Menu</li>
                  }
                  {headerItems.map((item) => {
                    const pathnames = item.to.split('/');
                    const key = pathnames[1] === 'chapters' ? // eslint-disable-line no-nested-ternary
                    `chapter-${pathnames[3] || ''}` :
                    (pathnames[1] === 'sfbw' ? `sfbw-${pathnames[2]}` : pathnames[1]);
                    const value = toggledItems[key] || false;
                    return (
                      <HeaderItem
                        key={item.to}
                        {...item}
                        toggled={value}
                        toggleItem={() => {
                          const toggles = Object.assign({}, toggledItems);
                          Object.keys(toggles).forEach((toggleKey) => {
                            toggles[toggleKey] = false;
                          });
                          this.setState({
                            toggledItems: {
                              ...toggles,
                              [key]: !value,
                            },
                          });
                        }}
                        setInactive={() => this.setState({ active: false })}
                      />
                    );
                  })}
                </ul>
              </nav>
            </div>
            <div className="footer">
              {
                member &&
                <AccountItem
                  active
                  member={user && user.member}
                  setInactive={() => this.setState({ active: false })}
                />
              }
              {
                agent &&
                <AccountItem
                  active
                  to="/sfbw/settings"
                  member={user && user.company}
                  setInactive={() => this.setState({ active: false })}
                />
              }
              <div className="nav-footer">
                <div className="guild-header">
                  <div
                    alt="SF BEER"
                    className="header-title"
                  >
                    { !agent &&
                      <span className="top">B.A.B.G PORTAL</span>
                    }
                    {
                      agent &&
                      <span className="top">SFBW PORTAL</span>
                    }
                    {/* <span className="members-portal">Member Portal</span> */}
                  </div>
                </div>
                {
                  loggedIn && !agent &&
                  <a
                    className="logout"
                    href="/"
                    onClick={() => localStorage.clear()}
                    alt="Log Out"
                  >
                    <i className="material-icons">power_settings_new</i>
                  </a>
                }

                {
                  loggedIn && agent &&
                  <a
                    className="logout"
                    href="/login/sfbw"
                    onClick={() => localStorage.clear()}
                    alt="Log Out"
                  >
                    <i className="material-icons">power_settings_new</i>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.shape({
    member: PropTypes.shape({}),
    role: PropTypes.string,
  }),
  chapters: PropTypes.arrayOf(PropTypes.shape({})),
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }).isRequired,
  }).isRequired,
  toggleActive: PropTypes.func,
  location: PropTypes.shape({}).isRequired,
};

Header.defaultProps = {
  user: null,
  chapters: [],
  toggleActive: () => {},
};

export default connect(
  state => ({
    ...state.users.auth,
    chapters: state.chapters.list._list,
  }),
  null,
  null,
  { pure: false },
)(withRouter(Header));

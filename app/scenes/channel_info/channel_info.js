// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PropTypes, PureComponent} from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

import ChannelInfoHeader from './channel_info_header';
import ChannelInfoRow from './channel_info_row';

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        marginTop: 40
    },
    separator: {
        flex: 1,
        marginHorizontal: 15
    },
    separatorContainer: {
        flex: 1,
        backgroundColor: '#fff',
        height: 1
    },
    scrollView: {
        flex: 1
    }
});

export default class ChannelInfo extends PureComponent {
    static propTypes = {
        currentChannel: PropTypes.object.isRequired,
        currentChannelCreatorName: PropTypes.string,
        currentChannelMemberCount: PropTypes.number,
        isFavorite: PropTypes.bool.isRequired,
        theme: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            getChannelStats: PropTypes.func.isRequired,
            goToChannelMembers: PropTypes.func.isRequired,
            markFavorite: PropTypes.func.isRequired,
            unmarkFavorite: PropTypes.func.isRequired
        })
    }

    constructor(props) {
        super(props);

        this.state = {
            isFavorite: this.props.isFavorite
        };
    }

    componentWillReceiveProps(nextProps) {
        const isFavorite = nextProps.isFavorite;
        if (isFavorite !== this.state.isFavorite) {
            this.setState({isFavorite});
        }
    }

    componentDidMount() {
        this.props.actions.getChannelStats(this.props.currentChannel.team_id, this.props.currentChannel.id);
    }

    handleFavorite = () => {
        const {isFavorite, actions, currentChannel} = this.props;
        const {markFavorite, unmarkFavorite} = actions;
        const toggleFavorite = isFavorite ? unmarkFavorite : markFavorite;
        this.setState({isFavorite: !isFavorite});
        toggleFavorite(currentChannel.id);
    }

    render() {
        const {
            currentChannel,
            currentChannelCreatorName,
            currentChannelMemberCount,
            theme
        } = this.props;

        return (
            <View style={style.container}>
                <ScrollView
                    style={style.scrollView}
                    contentContainerStyle={{backgroundColor: theme.centerChannelBg}}
                >
                    <ChannelInfoHeader
                        createAt={currentChannel.create_at}
                        creator={currentChannelCreatorName}
                        displayName={currentChannel.display_name}
                        header={currentChannel.header}
                        purpose={currentChannel.purpose}
                    />
                    <ChannelInfoRow
                        action={this.handleFavorite}
                        defaultMessage='Favorite'
                        detail={this.state.isFavorite}
                        icon='star-o'
                        textId='mobile.routes.channelInfo.favorite'
                        togglable={true}
                    />
                    <View style={style.separatorContainer}>
                        <View style={[style.separator, {backgroundColor: this.props.theme.centerChannelBg}]}/>
                    </View>
                    <ChannelInfoRow
                        action={() => true}
                        defaultMessage='Notification Preferences'
                        icon='bell-o'
                        textId='channel_header.notificationPreferences'
                    />
                    <View style={style.separatorContainer}>
                        <View style={[style.separator, {backgroundColor: this.props.theme.centerChannelBg}]}/>
                    </View>
                    <ChannelInfoRow
                        action={this.props.actions.goToChannelMembers}
                        defaultMessage='Manage Members'
                        detail={currentChannelMemberCount}
                        icon='users'
                        textId='channel_header.manageMembers'
                    />
                    <View style={style.separatorContainer}>
                        <View style={[style.separator, {backgroundColor: this.props.theme.centerChannelBg}]}/>
                    </View>
                    <ChannelInfoRow
                        action={() => true}
                        defaultMessage='Add Members'
                        icon='user-plus'
                        textId='channel_header.addMembers'
                    />
                    <View style={style.separatorContainer}>
                        <View style={[style.separator, {backgroundColor: this.props.theme.centerChannelBg}]}/>
                    </View>
                    <ChannelInfoRow
                        action={() => true}
                        defaultMessage='Leave Channel'
                        icon='sign-out'
                        textId='navbar.leave'
                    />
                    <View style={style.footer}>
                        <ChannelInfoRow
                            action={() => true}
                            defaultMessage='Delete Channel'
                            icon='trash'
                            iconColor='#DA4A4A'
                            textId='mobile.routes.channelInfo.delete_channel'
                            textColor='#DA4A4A'
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
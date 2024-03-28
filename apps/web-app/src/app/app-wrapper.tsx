import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {AuthenticatedApp} from './authenticated-app';
import {appBootstrap} from './platform/app-bootstrap';
import {AppState} from './state/app-state';
import {UnauthenticatedApp} from './unauthenticated-app';

const AppWrapperView = ({authenticated, bootstrapped}: ViewProps) => {
    useEffect(() => {
        bootstrapped()
    }, []);
    return <>
        {authenticated === true && <AuthenticatedApp/>}
        {authenticated !== true && <UnauthenticatedApp/>}
    </>;
}

type ViewProps = ConnectedProps<typeof connector>

const connector = connect(
    (state: AppState) => ({
        authenticated: state.authentication.authenticated,
    }),
    {
        bootstrapped: () => appBootstrap()
    }
);

export const AppWrapper = connector(AppWrapperView);

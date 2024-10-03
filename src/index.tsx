/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import BackgroundRenderer from './background/BackgroundRenderer'

const root = document.getElementById('root')
const backgroundRenderer = new BackgroundRenderer();

render(() => <App backgroundRenderer={backgroundRenderer} />, root!);

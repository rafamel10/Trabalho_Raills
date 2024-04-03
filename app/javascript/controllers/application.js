//= require jquery
//= require rails-ujs
//= require turbolinks
//= require_tree .
import jQuery from 'jquery';
window.jQuery = window.$ = jQuery;

import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

// Importe os arquivos JavaScript necessários
import '/javascript/jquery.min.js';
import '/javascript/jquery.scrollex.min.js';
import '/javascript/jquery.scrolly.min.js';
import '/javascript/browser.min.js';
import '/javascript/breakpoints.min.js';
import '/javascript/util.js';
import '/javascript/main.js';

export { application }

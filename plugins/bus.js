import Vue from 'vue';

export const EventBus = new Vue();

export default ({ app, store }, inject) => {
    inject("bus", EventBus);
};


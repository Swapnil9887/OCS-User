<template>
  <div class="row">
    <div class="col-md-12">
      <h3>Help</h3>
      <p>The Observation Portal is your access point to your network of telescopes.</p>
      <p>Registered users can:</p>
      <ul class="list-unstyled help-list">
        <li>
          <i class="fab fa-wpexplorer fa-fw" aria-hidden="true" />
          <span> <router-link :to="{ name: 'create' }"> Plan, compose, and submit observation requests</router-link> for approved proposals. </span>
        </li>
        <li>
          <i class="fa fa-check fa-fw" aria-hidden="true" />
          <span> <router-link :to="{ name: 'home' }"> Track the status</router-link> of submitted requests. </span>
        </li>
        <li>
          <i class="far fa-clock fa-fw" aria-hidden="true" />
          <span>
            <router-link :to="{ name: 'proposals' }"> Monitor the hours used by approved proposals.</router-link>
          </span>
        </li>
      </ul>
      <h3>Minimum Requirements</h3>
      <p>
        The following are the minimum versions of browsers required to use the observation portal. All other browsers/versions are supported on a
        best-effort basis.
      </p>
      <ul class="list-unstyled">
        <li>Google Chrome/Chromium: <strong>67+</strong></li>
        <li>Mozilla Firefox: <strong>78+</strong></li>
        <li>Apple Safari: <strong>11.1+</strong></li>
        <li>Microsoft Edge: <strong>80+</strong></li>
        <li>Internet Explorer: <strong>10+</strong> (minimal support)</li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.help-list > li {
  padding-top: 0.1em;
  padding-bottom: 0.1em;
}
</style>

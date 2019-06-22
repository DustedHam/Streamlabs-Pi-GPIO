<template>
  <div id="app">
    <div id="toggles">
      <input type="checkbox" id="bits" v-model="triggers.bits">
      <label for="bits">Bits</label>
      <input type="checkbox" id="donations" v-model="triggers.donations">
      <label for="donations">Donations</label>
      <input type="checkbox" id="subscription" v-model="triggers.subscription">
      <label for="subscription">Subscription</label>
    </div>

    <div class="form-div" id="bits-settings" v-if="triggers.bits">
      <strong>Bits:</strong>
      <v-min-max v-model="settings.bits"/>
    </div>

    <div class="form-div" id="donation-settings" v-if="triggers.donations">
      <strong>Donations:</strong>
      <v-min-max v-model="settings.donation"/>
    </div>

    <button v-on:click="save">Apply</button>
    <br>
    {{settings}}
  </div>
</template>

<script src="./app.js"/>
<style src="./app.css"/>

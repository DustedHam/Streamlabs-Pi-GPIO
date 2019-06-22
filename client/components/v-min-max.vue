<template>
  <div>
    <ul>
      <li>
        <label for="min" class="form-label">min:</label>
        <input type="number" class="form-input" id="min" v-model="value.min">
      </li>
      <li>
        <label for="max" class="form-label">max:</label>
        <input type="number" class="form-input" id="max" v-model="value.max">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "app",
  props: ["value"],
  data() {
    return {};
  },
  watch: {
    "value.min": function() {
      const value = this.value;
      const min = Math.max(0, parseInt(value.min));
      const max = parseInt(value.max);
      if (min > max) {
        value.max = min;
      }
      value.min = min;
    },
    "value.max": function() {
      const value = this.value;
      const min = parseInt(value.min);
      const max = parseInt(value.max);
      if (max < min) {
        value.min = max;
      }
      value.max = max;
    }
  }
};
</script>

<style>
ul {
  list-style: none;
}
.form-label {
  display: inline-block;
  width: 75px;
  text-align: right;
}
.form-input {
  width: 100px;
}
</style>

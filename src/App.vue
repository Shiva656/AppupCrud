<template>
  <div id="app">
    <b-container>
    <router-view></router-view>
     </b-container>
  </div>
</template>

<script>
export default {
};
</script>

<style>
@import url("https://cdn-500.500apps.com/fontawesome/css/all.css");
.dropdown-toggle::after{ display: none !important; }
.card-header .input-group-merge>.form-control {
    padding-top: 0;
    padding-bottom: 0;
    border-color: transparent!important;
    background-color: transparent!important;
}
.card-header .input-group-merge> .input-group-prepend .input-group-text {
    padding: 0 !important;
    border-width: 0 !important;
    background-color: transparent !important;
}
td .custom-checkbox,
th .custom-checkbox{
  margin-left: 5px;
}
.header-body .form-group {
    margin: 0px !important;
}
.header-body .form-group .dropdown-toggle{
  padding: 0px !important;
  border: 0px !important;
}
</style>

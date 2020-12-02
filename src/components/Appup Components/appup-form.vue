<template>
  <div>
    <div v-if="formTittle" class="page-title form-container">
      <h1>{{formTittle}}</h1>
    </div>
    <div class="col-12 p-5" v-show="showError||showSuccess">
      <appup-alert
        :message="messageAlert"
        alertType="failure"
        :show="showError"
        @dismissed="showError=false"
      ></appup-alert>
      <appup-alert
        :message="messageAlert"
        alertType="success"
        :show="showSuccess"
        @dismissed="showSuccess=false"
      ></appup-alert>
    </div>

    <b-form :id="id" class="appup-form text-left" @input="onFormInput" @reset="onReset" novalidate>
      <div :class="{ row: inline }">
        <template v-for="(item, n) in formFields">
          <!-- Tabs if first container -->
          <template v-if="item.container && !formFields[n-1].container">
            <!-- Iterate through all the loops inside till the container name is not the same-->
            <ul class="nav nav-tabs mb-4" :class="{ 'col-md-3': inline }" role="tablist" :key="n+'tab'">
              <template v-for="(tab, j) in getNextTabs(n)">
                <li role="presentation" class="nav-item" :key="j+tab">
                  <a
                    href="#"
                    role="tab"
                    data-toggle="tab"
                    @click.stop.prevent="setActiveTab(tab)"
                    :class="{'nav-link' : true, 'active': tab.isActive}"
                  >{{ tab.name }}</a>
                </li>
              </template>
            </ul>
          </template>

          <!-- Before field slot -->
          <slot v-if="item.name && condition(item) && showInTab(item)" :name="item.name"></slot>
          <div :class="inlineMethod(item)" :key="n" v-if="condition(item) && showInTab(item)">
            <b-form-group
              :id="'fgroup_'+item.id"
              :label-for="item.id"
              v-bind="getLabelInlineProps"
              :class="form_group_class"
            >
              <template v-if="item.label">
                <label>{{item.label}}</label>
                <span
                  v-if="item.label && item.required && !(item.required && item.required == 'false')|| item.required == 'true'"
                  class="required-star"
                  style="color: red;"
                >*</span>
                <span
                  v-if="item.label && item.show_info_icon && !(item.show_info_icon && item.show_info_icon == 'false')|| item.show_info_icon == 'true'"
                  class="ml-2 cursor-pointer"
                  v-b-tooltip.hover
                  :title="(item.info_icon_text)?item.info_icon_text:''"
                >
                  <i class="far fa-info-circle text-muted"></i>
                </span>
                <span
                  v-if="item.label && item.show_action_icon && !(item.show_action_icon && item.show_action_icon == 'false')|| item.show_action_icon == 'true'"
                  class="float-right"
                  @click="attachHandler(item['event.action'],$event)"
                >
                  <i
                    class="text-muted cursor-pointer"
                    v-b-tooltip.hover
                    :title="(item.action_icon_tooltip)?item.action_icon_tooltip:''"
                    :class="(item.action_icon_class)?item.action_icon_class:'fas fa-plus'"
                  ></i>
                </span>
              </template>

              <!-- Date Component -->
              <template
                v-if=" item.type == 'date'|| item.type == 'time'|| item.type == 'datetime'|| item.type == 'daterange'"
              >
                <appup-datetime
                  :name="item.name"
                  :id="item.id"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                  :type="item.type"
                  :config="convert_string_to_object(item.config) ? JSON.parse(item.config):item.config"
                  :class="item.class"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled && !(item.disabled && item.disabled == 'false')|| item.disabled == 'true'"
                  @input="attachHandler(item['event.input'],$event)"
                  @on-change="attachHandler(item['event.change'],$event)"
                />

                <!-- Form Help date for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Hidden Component -->
              <template v-else-if="item.type == 'hidden'">
                <input :id="item.id" class="form-control appup-hidden" type="hidden" />

                <!-- Form Help hidden for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Textarea Component -->
              <template v-else-if="item.type == 'textarea'">
                <b-form-textarea
                  :name="item.name"
                  :id="item.id"
                  v-model="form[item.name]"
                  :state="(form[item.name] && item.maxLength && (form[item.name].length > item.maxLength) || errors.has(item.name)) ? false : null"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :placeholder="item.placeholder"
                  :disabled="item.disabled && !(item.disabled && item.disabled == 'false')|| item.disabled == 'true'"
                  :rows="item.rows"
                  :max-rows="item['max-rows']"
                  :class="item.class"
                  @input="attachHandler(item['event.input'],$event)"
                  @change.native="attachHandler(item['event.change'],$event)"
                  @focus.native="attachHandler(item['event.focus'],$event)"
                  @blur.native="attachHandler(item['event.blur'],$event)"
                  @keydown.native="attachHandler(item['event.keydown'],$event)"
                  @keyup.native="attachHandler(item['event.keyup'],$event)"
                />
                <b-form-text
                  v-if="item.maxLength && form[item.name] && form[item.name].length <= item.maxLength"
                  align="right"
                >{{item.maxLength - form[item.name].length }} characters remaining</b-form-text>
                <!-- Form Help testarea for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
                <b-form-text
                  class="text-right"
                  v-if="item.display_charcount && form[item.name]"
                >{{form[item.name].length}} Characters</b-form-text>
              </template>

              <!-- Quilljs Component -->
              <template v-else-if="item.type == 'quilljs'">
                <appup-quilljs
                  :name="item.name"
                  :id="item.id"
                  v-model="form[item.name]"
                  :config="convert_string_to_object(item.config) ? JSON.parse(item.config):item.config"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :placeholder="item.placeholder"
                  :state="errors.has(item.name) ? false : null"
                  :class="item.class"
                  :s3presignurl="item.s3presignurl"
                />

                <!-- Form Help editor for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Tinymce Component -->
              <template v-else-if="item.type == 'tinymce'">
                <appup-tinymce
                  :name="item.name"
                  :apiKey="item.apiKey"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  v-model="form[item.name]"
                  :toolbar="item.toolbar"
                  :disabled="item.disabled"
                  :tag-name="item.tagName"
                  :init="item.init"
                  :id="item.id"
                  :inline="item.inline"
                  :state="errors.has(item.name) ? false : null"
                />

                <!-- Form Help editor for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Radio Component -->
              <template v-else-if="item.type == 'radio'">
                <appup-radio
                  :name="item.name"
                  :id="item.id"
                  :addElement="addElement"
                  :options="convert_string_to_object(item.option) ? JSON.parse(item.option):item.option"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  @input="attachHandler(item['event.input'],$event)"
                  :state="errors.has(item.name) ? false : null"
                  @radioChange="dynamicAddInput"
                  :class="'text-capitalize'+item.class"
                />
              </template>

              <!-- Checkbox Component -->
              <template v-else-if="item.type == 'checkbox'">
                <appup-checkbox
                  v-show="!item.hidden"
                  :name="item.name"
                  :id="item.id"
                  :addElement="addElement"
                  :url="item.url ? item.url : null"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  :options="convert_string_to_object(item.option) ? JSON.parse(item.option):item.option"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  @input="attachHandler(item['event.input'],$event)"
                  @change.native="manualInputTrigger"
                  @checkboxChange="dynamicAddInput"
                  :state="errors.has(item.name) ? false : null"
                  :class="item.class"
                />
              </template>

              <!-- switch button  -->
              <template v-else-if="item.type=='switch'">
                <ac-switch-button
                  :name="item.name"
                  :vaules_ob="convert_string_to_object(item.vaules_ob) ? JSON.parse(item.vaules_ob):item.vaules_ob"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :id="item.id"
                  :disabled="item.disabled"
                  @change="attachHandler(item['event.change'],$event)"
                  @input="attachHandler(item['event.input'],$event)"
                  v-model="form[item.name]"
                  :state="errors.has(item.name) ? false : null"
                ></ac-switch-button>
              </template>

              <!-- Dropdown Component -->
              <template v-else-if="item.type == 'dropdown' || item.type == 'select'">
                <appup-select
                  :id="item.id"
                  :name="item.name"
                  :re_render_key="item.re_render_key"
                  :url="item.url ? item.url : null"
                  :placeholder="item.placeholder"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  :addElement="addElement"
                  :refresh_icon="item.refresh_icon"
                  :logo_height="item.logo_height"
                  :logo_width="item.logo_width"
                  :options="convert_string_to_object(item.option) ? JSON.parse(item.option):item.option"
                  v-model="form[item.name]"
                  :disabled="item.disabled && !(item.disabled && item.disabled == 'false')|| item.disabled == 'true'"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                  @change="listenDropdownChange(n, $event, item)"
                  :state="errors.has(item.name) ? false : null"
                  @dropdownChange="dynamicAddInput"
                  :class="item.class"
                />

                <!-- Form Help dropdown for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'ac-dropdown'">
                <ac-dropdown
                  :name="item.name"
                  :id="item.id"
                  :split="convert_string_to_object(item.split) ? JSON.parse(item.split):item.split"
                  :size="item.size"
                  :split_variant="item.split_variant"
                  :variant="item.variant"
                  :split_href="item.split_href"
                  :split_button_type="item.split_button_type"
                  :dropdown_header="item.dropdown_header"
                  :dropdown_header_class="item.dropdown_header_class"
                  :no_caret="convert_string_to_object(item.no_caret) ? JSON.parse(item.no_caret):item.no_caret"
                  :lazy="convert_string_to_object(item.lazy) ? JSON.parse(item.lazy):item.lazy"
                  :items="convert_string_to_object(item.items) ? JSON.parse(item.items):item.items"
                  :url="item.url"
                  :base_url="item.base_url"
                  @d_item_clicked="emitFormAttachHandler(item['event.d_item_clicked'],$event)"
                  :class="item.class"
                ></ac-dropdown>

                <!-- Form Help dropdown for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Multiselect Component -->
              <template v-else-if="item.type == 'multiselect'">
                <appup-multiselect
                  :name="item.name"
                  :id="item.id"
                  :options="convert_string_to_object(item.option) ? JSON.parse(item.option):item.option"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :taggable="item.taggable"
                  :placeholder="item.placeholder"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                  @add_tag="emitFormAttachHandler(item['event.add_tag'],$event)"
                  :state="errors.has(item.name) ? false : null"
                  :url="item.url ? item.url : null"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  :class="item.class"
                  :emptysatemessage="item.message"
                  v-bind="convert_string_to_object(item.config) ? JSON.parse(item.config):item.config"
                />

                <!-- Form Help multiselect for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'typeahead'">
                <appup-typeahead
                  :name="item.name"
                  :id="item.id"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  @input="manualInputTrigger"
                  :state="errors.has(item.name) ? false : null"
                  :url="item.url ? item.url : null"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  :class="item.class"
                  :custom_query="item.custom_query ? item.custom_query : null"
                  :response-key="item.response_key ? item.response_key : null"
                  v-bind="convert_string_to_object(item.config) ? JSON.parse(item.config):item.config"
                  @remove="attachHandler(item['event.remove'],$event)"
                  @select="attachHandler(item['event.select'],$event)"
                />

                <!-- Form Help multiselect for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Tags Component -->
              <template v-else-if="item.type == 'tags'">
                <appup-tags
                  :name="item.name"
                  :id="item.id"
                  :options="convert_string_to_object(item.option) ? JSON.parse(item.option):item.option"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  @input="manualInputTrigger"
                  :state="errors.has(item.name) ? false : null"
                  :url="item.url ? item.url : null"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  v-bind="convert_string_to_object(item.config) ? JSON.parse(item.config):item.config"
                  :class="item.class"
                />

                <!-- Form Help tags for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- File Component -->
              <template v-else-if="item.type == 'file'">
                <appup-file
                  :name="item.name"
                  :id="item.id"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                  :placeholder="item.placeholder"
                  :supportedFormats="item.supportedFormats ? item.supportedFormats : null"
                  :class="item.class"
                  @input="attachHandler(item['event.input'],$event)"
                  @change.native="attachHandler(item['event.change'],$event)"
                />

                <!-- Form Help file for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>
               <!-- Merge Fields -->
              <template v-else-if="item.type === 'merge-fields'">
              <appup-merge-fields
              ref="appupMergefields"
              :controls="item.controls"
              @input="manualInputTrigger"
              v-model="form[item.name]"
              :id="item.id"
              :label="item.label"
              :name="item.name"
              v-validate="fetchValidationRules(item)"
               :data-vv-as="item.label"
              :state="errors.has(item.name) ? false : null"
              :validate_state="errors.has(item.name) ? false : null"/>
              </template>
              <!-- Section Component -->
              <template v-else-if="item.type == 'section'">
                <appup-section
                  ref="appupSection"
                  @drag-drop="attachHandler(item['event.drag_drop'],$event)"
                  @input="manualInputTrigger"
                  :default_key="item.default_key"
                  :radio="item.radio"
                  :radio_alignment="item.radio_alignment"
                  :radio_tooltip="item.radio_tooltip"
                  :button_options="typeof item.button_options == 'string'? JSON.parse(item.button_options) : item.button_options"
                  :rule_json="typeof item.rule_json == 'string'? JSON.parse(item.rule_json) : item.rule_json"
                  :prefill_data="typeof form[item.name] == 'string'? JSON.parse(form[item.name]) : form[item.name]"
                  v-model="form[item.name]"
                  :id="item.id"
                  :class="item.class"
                  :show_add_label="item.show_add_label"
                  :show_close_label="item.show_close_label"
                ></appup-section>

                <!-- Form Help file for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Code Editor -->
              <template v-else-if="item.type == 'code-editor'">
                <editor
                  v-model="form[item.name]"
                  @init="editorInit"
                  :lang="item.lang"
                  theme="chrome"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :name="item.name"
                  :width="item.width"
                  :height="item.height"
                  :class="item.class"
                  :state="errors.has(item.name) ? false : null"
                />

                <!-- Form Help code-editor for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>
              <template v-else-if="item.type == 'ide-editor'">
                <codemirror
                  v-model="form[item.name]"
                  :options="item.options"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :name="item.name"
                  :width="item.width"
                  :height="item.height"
                  :class="item.class"
                  :state="errors.has(item.name) ? false : null"
                />
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>
              <!-- Workflow Designer -->
              <template v-else-if="item.type == 'workflow'">
                <appup-workflow
                  :design_type="item.desgin"
                  :name="item.name"
                  ref="workflow"
                  :src="item.src"
                  :width="item.width"
                  :render="item.render"
                  :height="item.height"
                  :toolbar1="item.toolbar1"
                  :toolbar2="item.toolbar2"
                  :marketplace="item.marketplace"
                  v-model="form[item.name]"
                  :class="item.class"
                />

                <!-- Form Help workflow for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Plain HTML -->
              <template v-else-if="item.type == 'html'">
                <span v-html="item.html" :class="item.class"></span>

                <!-- Form Help html for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Upload File component -->
              <template v-else-if="item.type == 'upload'">
                <appup-upload
                  :name="item.name"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                  :upload_type="item.upload_type"
                  :allow_origin="item.allow_origin"
                  :content_type="item.content_type"
                  :custom_file_name="eval_values(item.custom_file_name)"
                  :uploadConfig="convert_string_to_object(item.uploadConfig) ? JSON.parse(item.uploadConfig):item.uploadConfig"
                  :show_image_preview="convert_string_to_object(item.show_image_preview) ? JSON.parse(item.show_image_preview):item.show_image_preview"
                  v-model="form[item.name]"
                  @after_upload="manualInputTrigger"
                  :class="item.class"
                />
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Grid - Array of Objects -->
              <!-- ref can be used to use grid api methods -->
              <template v-else-if="item.type == 'grid'">
                <appup-grid
                  :name="item.name"
                  ref="formgrid"
                  :columns="item.columns"
                  :form-json="item.formJson"
                  v-model="form[item.name]"
                  @input="$emit('input', form)"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Dual list -->
              <template v-else-if="item.type == 'dual-list'">
                <ac-dual-list
                  :name="item.name"
                  v-model="form[item.name]"
                  :collection_props="convert_string_to_object(item.collection) ? JSON.parse(item.collection):item.collection"
                  :dropdown_options="convert_string_to_object(item.dropdown) ? JSON.parse(item.dropdown):item.dropdown"
                  :options="convert_string_to_object(item.options) ? JSON.parse(item.options):item.options"
                  :key_value="item.key_value ? item.key_value : null"
                  :key_label="item.key_label ? item.key_label : null"
                  @change="attachHandler(item['event.change'],$event)"
                  :search_placeholder="item.search_placeholder ? item.search_placeholder : 'Filter'"
                  @dropdown_click="attachHandler(item['event.dropdown_click'],$event)"
                  @deleteAndInsert="attachHandler(item['event.deleteAndInsert'],$event)"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Excel Table -->
              <!-- :columns.sync="convert_string_to_object(item.columns) ? JSON.parse(item.columns):item.columns"
                  :group_data.sync="convert_string_to_object(item.group_data) ? JSON.parse(item.group_data):item.group_data" -->

              <template v-else-if="item.type == 'excel-table'">
                <ac-excel-table
                  :dropdown="item.excel_dropdown"
                  :dropdown_options="item.dropdown"
                  :dropdown_button_options="convert_string_to_object(item.dropdown_button_options) ? JSON.parse(item.dropdown_button_options):item.dropdown_button_options"
                  :show_dropdown_icons="item.show_dropdown"
                  :bulk="item.bulk"
                  :url="item.url"
                  :method="item.url_method_type"
                  :params="convert_string_to_object(item.params) ? JSON.parse(item.params):item.params"
                  :loading_image="item.loading_image"
                  :sort_key="item.sort_key"
                  :ac_cursor="convert_string_to_object(item.ac_cursor) ? JSON.parse(item.ac_cursor):item.ac_cursor"
                  :show_loadmore="item.show_loadmore"
                  :stg_data_count="item.stg_data_count"
                  :limit="item.limit"
                  :group_name="item.group_name"
                  :total_count="item.total_count"
                  :row_actions="convert_string_to_object(item.row_actions) ? JSON.parse(item.row_actions):item.row_actions"
                  :column_actions="convert_string_to_object(item.column_actions) ? JSON.parse(item.column_actions):item.column_actions"
                  :group_actions="convert_string_to_object(item.group_actions) ? JSON.parse(item.group_actions):item.group_actions"
                  :action_btn="convert_string_to_object(item.action_btn) ? JSON.parse(item.action_btn):item.action_btn"
                  @dropdown_click="attachHandler(item['event.event_test'],$event)"
                  :group_key="item.group_key"
                  :pagination_type="item.pagination_type"
                  :load_more_type="item.load_more_type"
                  :limit_key="item.limit_key"
                  :offset_key="item.offset_key"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'esign'">
                <ac-esign
                  :admin="item.permission"
                  :max_image_size="item.max_image_size"
                  :src="item.src"
                  :s3_config="item.s3_config_object"
                  :users_list="item.users"
                  :edit_tools="item.edit_tools"
                  :select_colors="item.select_colors"
                  :active_users_list="item.active_users_list"
                  @uploaded="save($event)"
                  v-model="form[item.name]"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                >
                  <template #process_loader>{{item.process_loader}}</template>
                  <template #viewer_loader>{{item.viewer_loader}}</template>
                  <template #thumbnails_loader>{{item.thumbnails_loader}}</template>
                </ac-esign>
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>
              <!-- Swatches -->
              <template v-else-if="item.type == 'swatches'">
                <ac-swatches
                  :name="item.name"
                  v-model="form[item.name]"
                  :color_v_model="form[item.name]"
                  :colors="convert_string_to_object(item.colors) ? JSON.parse(item.colors):item.colors"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- copy the code -->
              <template v-else-if="item.type == 'copy-code'">
                <appup-copycode
                  :name="item.name"
                  :copy="item.copy"
                  :share="item.share"
                  :copy_data="item.copy_data"
                  :share_data="item.share_data"
                  v-model="form[item.name]"
                  @share="attachHandler(item['event.share'],$event)"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Data range picker -->
              <template v-else-if="item.type == 'date-range'">
                <ac-date-range-picker
                  :name="item.name"
                  :opens="item.opens"
                  :date_format="item.dateFormat"
                  @date-range-selected="attachHandler(item['event.date-range-selected'],$event)"
                  :min_date="item.minDate"
                  :max_date="item.maxDate"
                  :single_date_picker="item.singleDatePicker"
                  :show_week_numbers="item.showWeekNumbers"
                  :show_dropdowns="item.showDropdowns"
                  :auto_apply="item.autoApply"
                  :ranges_url="item.ranges_url"
                  v-model="form[item.name]"
                  :epoch_format="item.epoch_format"
                  :show_ranges="item.showRanges"
                  :time_picker="item.timePicker"
                  :time_picker_24_hour="item.timePicker24Hour"
                  :time_picker_increment="item.timePickerIncrement"
                  :time_picker_seconds="item.timePickerSeconds"
                  :ranges="item.showRanges ? ( item.ranges ? convert_string_to_object(item.ranges) ? JSON.parse(item.ranges):item.ranges : undefined ) : false"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                  @add_custom_range="emitFormAttachHandler(item['event.input'],$event)"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Form type - Inner form component which takes form json or REST URL with form json response and constructs a form  -->
              <template v-else-if="item.type == 'form'">
                <appup-form
                  :name="item.name"
                  :fields-url="item.fieldsUrl"
                  :form-json="item.formJson"
                  :form-data="form[item.name]"
                  v-model="form[item.name]"
                  ref="form"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />

                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'ui-builder'">
                <appup-builder
                  :name="item.name"
                  ref="builder"
                  :src="item.src"
                  :width="item.width"
                  :height="item.height"
                  v-model="form[item.name]"
                  :class="item.class"
                  v-validate="fetchValidationRules(item)"
                />
              </template>

              <template v-else-if="item.type == 'email-builder'">
                <ac-email-builder
                  :name="item.name"
                  :render="item.render"
                  v-model="form[item.name]"
                  :data="form[item.name]"
                  :plugin="item.plugin"
                  v-validate="fetchValidationRules(item)"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                />
              </template>

              <template v-else-if="item.type == 'designer'">
                <appup-designer
                  :name="item.name"
                  ref="designer"
                  :src="item.src"
                  :render="item.render"
                  :width="item.width"
                  :height="item.height"
                  v-model="form[item.name]"
                  :class="item.class"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                />
              </template>
              <!-- <template v-else-if="item.type == 'ui-buildly'">
                <appup-buildly
                  :name="item.name"
                  ref="buildly"
                  :src="item.src"
                  :width="item.width"
                  :height="item.height"
                  v-model="form[item.name]"
                  :class="item.class"
                  v-validate="fetchValidationRules(item)"
                  :state="errors.has(item.name) ? false: null"
                />
              </template>

              <template v-else-if="item.type == 'ui-mockly'">
                <appup-mockly
                  :name="item.name"
                  ref="mockly"
                  :src="item.src"
                  :width="item.width"
                  :height="item.height"
                  v-model="form[item.name]"
                  :class="item.class"
                  v-validate="fetchValidationRules(item)"
                  :state="errors.has(item.name) ? false: null"
                />
              </template>-->

              <template v-else-if="item.type == 'form-builder'">
                <ac-helper-form
                  :name="item.name"
                  v-model="form[item.name]"
                  @saveRecord="$emit('input', form)"
                  @deleteItem="$emit('input', form)"
                  @copyItem="$emit('input', form)"
                  :class="item.class"
                  v-validate="fetchValidationRules(item)"
                  :data-vv-as="item.label"
                  :state="errors.has(item.name) ? false : null"
                ></ac-helper-form>
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'template-render'">
                <ac-html :html="item.html" :url="item.url" />
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <template v-else-if="item.type == 'canvas'">
                <ac-canvas
                  :name="item.name"
                  :canvas_id="item.canvas_id"
                  :canvas_config="convert_string_to_object(item.canvas_config) ? JSON.parse(item.canvas_config):item.canvas_config"
                  v-model="form[item.name]"
                  @input="emitFormAttachHandler(item['event.input'],$event)"
                ></ac-canvas>
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- For all other fileds like text,email,number,url,tel,search,range,password,color,etc., -->
              <template v-else>
                <b-input-group :prepend="item.prepend" :append="item.append">
                  <b-form-input
                    :disabled="item.disabled && !(item.disabled && item.disabled == 'false')|| item.disabled == 'true'"
                    class="appup-input"
                    :id="'input_'+item.id"
                    :name="item.name"
                    :type="item.type"
                    :placeholder="item.placeholder"
                    v-model="form[item.name]"
                    v-validate="fetchValidationRules(item)"
                    :data-vv-as="item.label"
                    :state="errors.has(item.name) ? false : null"
                    :class="item.class"
                    @input="attachHandler(item['event.input'],$event)"
                    @change.native="attachHandler(item['event.change'],$event)"
                    @focus.native="attachHandler(item['event.focus'],$event)"
                    @blur.native="attachHandler(item['event.blur'],$event)"
                    @keydown.enter="preventMethod($event)"
                    @keydown.native="attachHandler(item['event.keydown'],$event)"
                    @keyup.native="attachHandler(item['event.keyup'],$event)"
                  ></b-form-input>

                  <!-- Toogle password field if showPassword is true -->
                  <b-input-group-text slot="append" v-if="item.showPassword">
                    <a
                      @click="item.type === 'password' ? item.type = 'text' : item.type = 'password'"
                    >
                      <i class="fas fa-eye-slash" v-if="item.type === 'password'"></i>
                      <i class="fas fa-eye" v-else></i>
                    </a>
                  </b-input-group-text>
                </b-input-group>

                <!-- Form Help text for description -->
                <b-form-text v-if="item.description">{{item.description}}</b-form-text>
              </template>

              <!-- Placeholder for form fields validation messages -->
              <span
                v-show="errors.has(item.name)"
                class="invalid-feedback"
                style="display: block"
              >{{ errors.first(item.name) }}</span>
            </b-form-group>
          </div>
          <!-- After field slot -->
          <slot
            v-if="item.name && condition(item) && showInTab(item)"
            :name="item.name + '-after' "
          ></slot>
        </template>
      </div>
      <div
        v-if="buttons && buttons.length"
        class="mb-2 form-save"
        :class="[ button_group_class, {'d-none': position!='bottom',
                                    'text-center': direction=='center',
                                    'text-left': direction=='left',
                                    'text-right': direction=='right'}] "
      >
        <b-button
          class="submit-button"
          v-for="(btn, index) in buttons"
          :id="btn.id"
          :disabled="btn.disabled"
          :key="`btn-bottom-${index}`"
          :type="(btn.type === 'submit') ? 'submit' : 'button'"
          :variant="btn.variant"
          :workflow="btn.workflow"
          :class="btn.class"
          @click="attach_handler_on_button_click($event, btn)"
        >{{btn.label}}</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
/**
 * Appup Form component rendering form elements based upon provided schema. Includes validation rules as well.
 *
 * TODOs:
 *
 * Reset form elements
 *
 * Submit form data to API
 *
 * Testing edit with form data prepopulated
 *
 * Dynamic element added based on other component selection
 */
import { AjaxRequests } from '../../mixins/ajaxRequests';
import { Workflow } from '../../mixins/workflow';
import { AppupEvents } from '../../mixins/events';
import { GlobalFunc } from '../../mixins/globalFunctions';
import appupBuilder from './Form Components/builder.vue';
import appupDesigner from './Form Components/designer.vue';
import appupBuildly from './Form Components/buildly.vue'
import appupMockly from './Form Components/mockly.vue';
import AppupAlert from './Form Components/appup-alert.vue';
import AppupDateTime from './Form Components/appup-datetime.vue';
import AppupTinymce from './Form Components/appup-tinymce.vue';
import AppupRadio from './Form Components/appup-radio.vue';
import AppupCheckBox from './Form Components/appup-checkbox.vue';
import AcSwitchButton from './Form Components/ac-swich-button.vue';
import AppupTags from './Form Components/appup-tags'
import AppupSelect from './Form Components/appup-select.vue';
import AcDropdown from './Form Components/ac-dropdown.vue';
import AppupMultiSelect from './Form Components/appup-multiselect.vue'
import AppupTypeAhead from './Form Components/appup-typeahead.vue'
import AcCanvas from './Form Components/ac-canvas';
import AcHtml from './Form Components/ac-html'
import AcHelperForm from './Form Components/ac-helper-form';
import AppupSection from './Form Components/appup-section';
import AppupUpload from './Form Components/appup-upload';
import AcDualList from './Form Components/ac-dual-list';
import AcSwatches from './Form Components/ac-swatches';
import AcDateRangePicker from './Form Components/ac-date-range-picker';
import AcEmailBuilder from './/Form Components/ac-email-builder'
// Import AppupWorkflow from './Form Components/appup-workflow'
// Import AppupMergeFields from './Form Components/appup-merge-fields';
import Appupfile from './Form Components/appup-file'
// eslint-disable-next-line no-unused-vars
import Vue from 'vue';
import { codemirror } from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/theme/base16-light.css';
import 'codemirror/lib/codemirror.css'
export default {
  name: 'appup-form',
  mixins: [AjaxRequests, Workflow, AppupEvents, GlobalFunc],
  components: {
    editor: require('chapalamadugu-vue2-ace-editor'),
    appupBuilder,
    'appup-tinymce': AppupTinymce,
    'appup-radio': AppupRadio,
    'ac-switch-button': AcSwitchButton,
    'appup-select': AppupSelect,
    'ac-dropdown': AcDropdown,
    //  'appup-merge-fields': AppupMergeFields,
    'appup-multiselect': AppupMultiSelect,
    'appup-typeahead': AppupTypeAhead,
    'ac-canvas': AcCanvas,
    'ac-html': AcHtml,
    'ac-helper-form': AcHelperForm,
    'appup-tags': AppupTags,
    'appup-file': Appupfile,
    'appup-section': AppupSection,
    'ac-swatches': AcSwatches,
    'appup-upload': AppupUpload,
    'ac-date-range-picker': AcDateRangePicker,
    'ac-email-builder': AcEmailBuilder,
    // 'appup-workflow': AppupWorkflow,
    appupDesigner,
    // eslint-disable-next-line vue/no-unused-components
    appupBuildly,
    'appup-alert': AppupAlert,
    'appup-datetime': AppupDateTime,
    'appup-checkbox': AppupCheckBox,
    'ac-dual-list': AcDualList,
    // eslint-disable-next-line vue/no-unused-components
    appupMockly,
    codemirror
  },
  props: {
    /**
     * Id of input elements.
     */
    id: {
      type: String,
      required: false
    },

    /**
     * Position of group buttons.
     *
     * `top`, `bottom`
     */
    position: {
      type: String,
      required: false,
      default: 'bottom'
    },

    /**
     * Position of group buttons.
     *
     * `center`, `left`, `right`
     */
    direction: {
      type: String,
      required: false,
      default: 'right'
    },

    /**
     * URL to deserialize the form initially.
     */
    preload: {
      type: String,
      required: false
    },

    /**
     * Submit Workflow ID
     */
    submit: {
      type: String,
      required: false
    },
    /**
     * Name of input elements.
     */
    name: {
      type: String,
      required: false
    },

    /**
     * Fetch data with url
     */
    url: {
      type: String,
      required: false
    },

    /**
     * The type attribute specifies the type of <strong>input</strong> element to display.
     *
     * <var>text, password, email, number,url, tel</var>
     * <br/><var>date, time, datetime, daterange</var>
     * <br/><var>radio, checkbox, textarea, hidden, code, editor</var>
     * <br/><var>dropdown, multiselect, tags</var>
     *
     */
    type: {
      type: String,
      required: false,
      default: 'text'
    },

    /**
     * The placeholder attribute specifies a short hint that describes the expected value of an input field.
     */
    placeholder: {
      type: String,
      required: false
    },

    /**
     * Model Object that should be passed to the input
     */
    value: {
      required: false
    },

    /**
     * Options for Dropdown, Radio & Checkbox
     */
    options: {
      type: Array,
      required: false
    },

    /**
     * State of the input field based upon validation rules
     *
     * false - highlights the field in red
     * <br/>true - highlights the field in green
     * <br/>null - nothing
     */
    state: {
      type: Boolean,
      required: false,
      default: null
    },

    /**
     * Supported extension files to be selected when input type is File
     *
     * Example: ['.jpg', '.pdf', '.docx'] etc..
     */
    supportedFormats: {
      type: Array,
      required: false
    },

    /**
     * @ignore
     */
    disabled: {
      type: Boolean,
      required: false
    },

    /**
     * Flag to check type of add element or valid the value.
     *
     * `true, false`
     */
    addElement: {
      type: Boolean,
      required: false,
      default: false
    },
    /**
     * Form tittle
     */
    formTittle: {
      type: String,
      required: false
    },
    /**
     * Load form from form-json object data
     * if this is set preload handler will not call
     */
    formJson: {
      type: Object,
      default: null
    },

    /**
     * Prepopulate form with this data
     */
    formData: {
      type: Object,
      default: null
    },

    /**
     * Get form fields json from fieldsUrl
     */
    fieldsUrl: {
      type: String,
      default: ''
    },

    /**
     * Display form fields horizontal if set to true
     */
    inline: {
      type: Boolean,
      default: false
    },

    /**
     * Display form field labels horizontal
     */
    inlineLabels: {
      type: Boolean,
      default: false
    },
    form_group_class: {
      type: String
    },
    button_group_class: {
      type: String
    },
    // Use to re render the component
    re_render_key: {
      type: Number,
      default: 0
    },
    // It's represent template type like generics and appup/helper
    template_type: {
      type: String,
      default: 'appup'
    }
  },
  data: function () {
    return {
      form: {},
      typeAlert: 'failure',
      showSuccess: false,
      showError: false,
      messageAlert: '',
      inputValue: this.value,
      formFields: [],
      buttons: [],
      tabs: {},
      char_tot_count: 0
    };
  },
  computed: {
    getLabelInlineProps () {
      if (this.inlineLabels) {
        return {
          'label-cols-md': 3
        };
      } else {
        return {};
      }
    }
  },
  watch: {
    value (newVal, oldVal) {
      this.inputValue = newVal;
    },
    formFields (newVal, oldVal) {
      this.formFields.forEach(field => {
        if (field.value) {
          if (this.formData) {
            // eslint-disable-next-line no-prototype-builtins
            if (!this.formData.hasOwnProperty(field.name)) {
              this.$set(this.form, field.name, field.value);
            }
          } else {
            this.$set(this.form, field.name, field.value);
          }
        }
      });
      this.$emit('input', this.form);
    },
    form: {
      handler (val, oldVal) {
        console.log(val);
      },
      deep: true
    },
    formData: {
      handler (val, oldVal) {
        // Give the value of the component (this) as vm for computational fields
        const vm = this;

        // Computational
        this.formFields.forEach(field => {
          if (field.computation) {
            // Form as users may not give this.form
            let form = this.form;
            if (field.computation.includes('form.' + field.name)) {
              form = vm.self_fields_computation(field, oldVal);
            }
            // eslint-disable-next-line no-unused-vars
            const func = field.computation;
            // eslint-disable-next-line no-eval
            const val = eval(field.computation);
            field.value = val;
            form[field.name] = val;
          }
        });
        this.form = JSON.parse(JSON.stringify(val));
      },
      deep: true
    },
    formJson: {
      handler (val) {
        this.formFields = val.fields;
        this.buttons = val.buttons;

        // If form is null, set empty object. This solves null error in v-model
        if (!this.form) {
          this.form = {};
        }
      },
      deep: true
    }
  },
  created () {
    this.formFields.forEach(field => {
      if (field.value) {
        if (this.formData) {
          // eslint-disable-next-line no-prototype-builtins
          if (!this.formData.hasOwnProperty(field.name)) {
            this.$set(this.form, field.name, field.value);
          }
        } else {
          this.$set(this.form, field.name, field.value);
        }
      }
    });
    if (this.template_type === 'generics') {
      this.$emit('preload');
    } else if (this.template_type === 'appup') {
      if (this.preload) {
        try {
          // For multiple handlers
          this.start(JSON.parse(this.preload));
        } catch (error) {
          this.start(this.preload);
        }
      } else {
        if (this.fieldsUrl) {
          this.getFormJsonFromUrl();
        } else {
          this.setFormFields();
        }
      }
    }
    // Prepopulate form
    if (this.formData) {
      this.form = JSON.parse(JSON.stringify(this.formData));
    }

    this.$emit('input', this.form);
  },
  methods: {
    preventMethod: function (event) {
      event.preventDefault();
    },
    // Empty previous computational values to avoid infinite looping
    self_fields_computation (field, oldVal) {
      var form = this.form;
      var computationValues = field.computation.split('+');
      // Replace empty in the place of static strings
      for (var key in computationValues) {
        if (computationValues[key].startsWith("'")) {
          // eslint-disable-next-line no-unused-expressions
          form[field.name] ? '' : (form[field.name] = '');
          form[field.name] = form[field.name].replace(
            // eslint-disable-next-line no-eval
            eval(computationValues[key]),
            ''
          );
        }
      }
      // Replace empty in the place of other form fields provided in computation
      var cFields = field.computeFields.split(',');
      for (const key in cFields) {
        // eslint-disable-next-line eqeqeq
        if (cFields[key] != field.name) {
          // eslint-disable-next-line no-unused-expressions
          form[field.name] ? '' : (form[field.name] = '');
          if (form[field.name].length > 0) {
            form[field.name] = form[field.name].replace(
              oldVal[cFields[key]],
              ''
            );
          }
        }
      }
      return form;
    },
    attach_handler_on_button_click (evt, button) {
      if (this.template_type === 'generics') {
        this.$emit('submit', { event: evt, button: button });
      } else if (this.template_type === 'appup') {
        const type = button.type;
        evt.preventDefault();
        if (type === 'submit') {
          this.onSubmit(evt);
        } else {
          let convertHandlerParams = null;
          try {
            convertHandlerParams = JSON.parse(button.handlerParams);
          } catch (error) {
            convertHandlerParams = button.handlerParams;
          }
          if (button.handlerName) {
            this.start(button.handlerName, {
              handlerParams: convertHandlerParams || {}
            });
          }
        }
      }
    },
    convert_string_to_object (value) {
      try {
        JSON.parse(value);
        return true;
      } catch (error) {
        return false;
      }
    },
    emitFormAttachHandler (handlerName, event) {
      console.log('in emitFormAttachHandler');

      // Emit form
      this.manualInputTrigger();

      // Call handler
      this.attachHandler(handlerName, event);
    },

    listenDropdownChange (index, event, item) {
      this.$set(this.form, this.formFields[index].name, event.value);
      this.attachHandler(item['event.change'], event);
    },

    manualInputTrigger () {
      this.$emit('input', this.form);
    },

    onSubmit (evt) {
      evt.preventDefault();

      // Call the workflow
      if (this.submit) {
        console.log('Calling workflow');
        try {
          this.start(JSON.parse(this.submit));
        } catch (error) {
          this.start(this.submit);
        }
      }
    },
    onReset (evt) {
      // Evt.preventDefault();
      this.errors.clear();
    },
    onCancel (evt) {
      console.log('cancel');
      evt.preventDefault();
    },
    onSuccess (evt, success, response) {
      console.log('response', response);
      switch (success.type) {
        case 'navigate':
          this.onNavigate(evt, success.data);
          break;
      }
      evt.preventDefault();
    },
    onError (evt, error) {
      switch (error.type) {
        case 'navigate':
          this.onNavigate(evt, error.data);
          break;
      }
      evt.preventDefault();
    },
    onFormInput (e) {
      console.log('On Form input ....');
      if (e.target.type !== 'checkbox' && e.target.type !== 'radio') {
        this.$emit('input', this.form);
      }
    },
    /**
     * Set handler as an event callback
     */
    attachHandler (handlers, event) {
      if (typeof handlers === 'object') {
        const handlersList = [];
        for (let i = 0; i < handlers.length; i++) {
          handlersList[i] = {};
          handlersList[i].name = handlers[i].name;

          let handlersParams = {};
          try {
            if (typeof handlers[i].params === 'object') {
              handlersParams = handlers[i].params;
            } else {
              handlersParams = JSON.parse(handlers[i].params);
            }
          } catch (error) {
            handlersParams = {};
          }
          handlersList[i].params = {
            event: event,
            handlerParams: handlersParams
          };
        }
        if (handlersList.length > 0) {
          this.start(handlersList);
        }
      } else if (typeof handlers === 'string') {
        this.start(handlers);
      }
      /* If (event.target.tagName == "TEXTAREA") {
        // this.char_tot_count = event.target._value.length;
      } */
    },
    fetchValidationRules (field) {
      let rule = {};

      if (field.validation) {
        try {
          rule = JSON.parse(field.validation);
        } catch {
          rule = field.validation;
        }
      }

      // Set Required
      if (field.required) {
        rule.required = JSON.parse(field.required)
          ? field.required
          : JSON.parse(field.required);
      }

      // Validation rules based upon field type
      if (
        field.type === 'text' ||
        field.type === 'password' ||
        field.type === 'textarea' ||
        field.type === 'code-editor'
      ) {
        if (field.minLength) {
          rule.min = field.minLength;
        }
        if (field.maxLength) {
          rule.max = field.maxLength;
        }
      } else if (field.type === 'email') {
        rule.email = true;
      } else if (field.type === 'number') {
        if (field.numeric) {
          rule.numeric = JSON.parse(field.numeric)
            ? field.numeric
            : JSON.parse(field.numeric);
        } else rule.numeric = true;
        if (field.min) {
          rule.min_value = field.min;
        }
        if (field.max) {
          rule.max_value = field.max;
        }
      } else if (field.type === 'code-editor') {
        if (field.lang === 'json') rule.json = true;
      }

      return rule;
    },
    wait (ms, cb) {
      setTimeout(cb, ms);
    },
    dynamicAddInput (value, id, type) {
      // To reflect change in radio button
      if (type === 'radio') {
        this.$emit('input', this.form);
      }
      this.$emit('dynamicAddInput', value, id, type);
    },
    showAlertError (error) {
      console.log(error);
      this.showError = true;
      this.messageAlert = error.data.responseText;
    },
    showAlertSuccess (error, transfer) {
      console.log(error, transfer);
      this.showSuccess = true;
      this.messageAlert = error.data;
    },
    designer_save (callback) {
      // Check if designer exists
      const field = this.formFields.find(x => x.type === 'workflow');

      // Execute callback if there is no designer
      if (!field) {
        callback();
        return;
      }

      // Call Designer Save - this is asynchronous
      this.$refs.workflow[0].save().then(() => {
        console.log('Saved ');
        this.form[field.name] = this.$refs.workflow[0].get_json();
        console.log('Designer form saved ' + this.form[field.name]);

        // Call the next node from validate
        callback();
      });
    },
    builder_save (callback) {
      // Check if ui builder exists
      const field = this.formFields.find(x => x.type === 'ui-builder');

      // Execute callback if there is no builder
      if (!field) {
        callback();
        return;
      }

      // Call builder Save - this is asynchronous
      if (
        typeof this.$refs.builder !== 'undefined' &&
        this.$refs.builder.length !== 0
      ) {
        this.$refs.builder[0].save().then(() => {
          console.log('Builder saved');
          this.form[field.name] = this.$refs.builder[0].getJson();
          console.log('Builder form saved ' + this.form[field.name]);

          // Call the next node from validate
          callback();
        });
      } else {
        callback();
      }
    },
    bm_save (callback) {
      // Check if ui builder exists
      const field = this.formFields.find(x => x.type === 'designer');

      // Execute callback if there is no builder
      if (!field) {
        callback();
        return;
      }

      // Call BM-builder Save - this is asynchronous
      if (
        typeof this.$refs.designer !== 'undefined' &&
        this.$refs.designer.length !== 0
      ) {
        this.$refs.designer[0].save().then(() => {
          console.log('Builder saved');
          this.form[field.name] = this.$refs.designer[0].get_json();
          console.log('Builder form saved ' + this.form[field.name]);

          // Call the next node from validate
          callback();
        });
      } else {
        callback();
      }
    },
    condition (item) {
      if (!item.condition) return true;

      // Users may not call this.form - they will just call form
      // eslint-disable-next-line no-unused-vars
      const form = this.form;
      // eslint-disable-next-line no-eval
      return eval(item.condition);
    },
    eval_values (value) {
      // eslint-disable-next-line no-unused-vars
      const form = this.form;
      // eslint-disable-next-line no-eval
      return eval(value);
    },
    editorInit: function () {
      /* Init editor with the options we need */

      require('brace/ext/language_tools'); // Language extension prerequsite...
      require('brace/mode/html');
      require('brace/mode/javascript'); // Language
      require('brace/mode/scss');
      require('brace/mode/json');
      require('brace/theme/chrome');
      require('brace/snippets/javascript'); // Snippet
    },
    getNextTabs (index) {
      // Return all tabs from here
      const tabs = [];

      // Get Tab name
      const tabName = this.formFields[index].container;

      // eslint-disable-next-line no-prototype-builtins
      if (this.tabs.hasOwnProperty(tabName)) {
        return this.tabs[tabName].tabs;
      }

      // Iterate through next till we hit a different tab or final destination
      let loop = 0;
      while (1) {
        // If it is not container, break
        if (!this.formFields[index + loop].container) break;

        // If the previous one is not container or the container name does not match with the previous one, add to the list
        if (
          !this.formFields[index + loop - 1].container ||
          // eslint-disable-next-line eqeqeq
          this.formFields[index + loop]['container-name'] !=
            this.formFields[index + loop - 1]['container-name']
        ) {
          tabs.push({
            name: this.formFields[index + loop]['container-name'],
            isActive: !!this.formFields[index + loop]['container-active'],
            container: this.formFields[index + loop].container
          });
        }

        loop++;
      }

      // Push to tabs too
      if (!this.tabs[tabName]) this.tabs[tabName] = {};
      this.tabs[tabName].tabs = tabs;

      // Set to selected
      this.tabs[tabName].selected = tabs.find(tab => tab.isActive).name;
      return tabs;
    },
    setActiveTab (tab) {
      // Get tab name
      const name = tab.container;

      this.tabs[name].selected = tab.name;

      // Make the tab active
      this.tabs[name].tabs.forEach(tab => (tab.isActive = false));
      tab.isActive = true;

      // Vue cannot see inner data, we need to reset it by add noop JSON
      this.tabs = Object.assign({}, this.tabs);
    },
    showInTab (item) {
      // If it is not a part of container - return
      if (!item.container) return true;

      // Get name
      const tabName = item.container;

      // Get Selected
      const selected = this.tabs[tabName].selected;

      // See if the current tab in active
      // eslint-disable-next-line eqeqeq
      return selected == item['container-name'];
    },
    /**
     * Sets class to form group (from json schema)
     */
    setClass (className) {
      // Form-control check is to support legacy json schema
      if (
        typeof className !== 'undefined' &&
        // eslint-disable-next-line eqeqeq
        className != '' &&
        // eslint-disable-next-line eqeqeq
        className != 'form-control'
      ) {
        return className;
      } else {
        // Default is single column
        return 'col-md-12';
      }
    },
    // Update grid fields data
    gridInput (value, n) {
      Vue.set(this.form, this.formFields[n].name, JSON.stringify(value));

      // Custom fields will not trigger form input event, so required to do it manually
      this.$emit('input', this.form);
    },

    // Set form fields from formJsons
    setFormFields () {
      this.formFields = this.formJson.fields;
      this.buttons = this.formJson.buttons;
    },

    // Make http call and get form json from fieldsUrl
    getFormJsonFromUrl () {
      // Axios
      //   .get(this.fieldsUrl, { withCredentials: true, credentials: "include" })
      //   .then(response => {
      // This.$appupajax
      //   .get2(
      //     This.fieldsUrl,
      //     {},
      //     { withCredentials: true, credentials: "include" }
      //   )
      this.$appupajax
        .get2(
          this.fieldsUrl,
          {},
          {},
          { withCredentials: true, credentials: 'include' }
        )
        .then(this.$appupajax.handleResponse)
        .then(response => {
          const result = JSON.parse(JSON.stringify(response));
          if (this.formJson) {
            if (this.formJson.fields && result.data.fields) {
              this.formJson.fields = this.formJson.fields.concat(
                result.data.fields
              );
            } else if (!this.formJson.fields && result.data.fields) {
              this.formJson.fields = result.data.fields;
            }

            if (this.formJson.buttons && result.data.buttons) {
              this.formJson.buttons = this.formJson.buttons.concat(
                result.data.buttons
              );
            } else if (!this.formJson.buttons && result.data.buttons) {
              this.formJson.buttons = result.data.buttons;
            }
            delete result.data.fields;
            delete result.data.buttons;
            this.formJson = { ...this.formJson, ...result.data };
            // Console.log("final formJson", this.formJson)
          } else {
            this.formJson = result.data;
          }
          this.setFormFields();
        });
    },
    triggerSubmit () {
      this.$el.getElementsByClassName('appup-form')[0].submit();
    },
    inlineMethod (item) {
      if (this.inline && item.inlineClass) {
        return item.inlineClass;
      } else if (this.inline) {
        return 'col-md-3';
      } else {
        return '';
      }
    },
    save (e) {
      this.$emit('upload', e);
    }
  }
};
</script>

<template>
  <q-layout ref="layout-padding" >

    <q-toolbar slot="header">
      <q-btn flat @click="$router.push('/')">
        <q-icon name="arrow_back" />
      </q-btn>
      <q-toolbar-title>
        Settings
      </q-toolbar-title>
    </q-toolbar>

    <q-list class="no-border">
      <q-list-header >Time Formatting</q-list-header>
      <q-item sparse  >
        <q-item-main>
          <q-checkbox v-model="fuzzyTime" label="Use Fuzzy Time" />
        </q-item-main>
      </q-item>
      <q-item >
        <q-item-main>
          <q-select filter v-model="formatSelect" float-label="Date Format" :options="formatOptions" />
        </q-item-main>
      </q-item>
      <q-item  >
        <q-item-main>
          <q-select v-model="detailSelect" float-label="Date Detail" :options="detailOptions" />
        </q-item-main>
      </q-item>
      <q-list-header >Miscellanous</q-list-header>
      <q-item >
        <q-item-main>
          <q-select filter v-model="languageSelection" float-label="Interface Language" :options="languageOptions" />
        </q-item-main>
      </q-item>
      <q-item sparse link @click="$refs.aboutModal.open()">
        <q-item-main>
          About
        </q-item-main>
      </q-item>
    </q-list>

    <q-modal maximized ref="aboutModal">
      <q-modal-layout>
        <q-toolbar slot="header">
          <q-btn flat @click="$refs.aboutModal.close()"> <q-icon name="keyboard_arrow_left" /> </q-btn>
          <div class="q-toolbar-title">About Shimekiri</div>
        </q-toolbar>
        <div class="layout-padding">
          <q-card flat>
            <q-card-title>
              <span>Shimekiri</span>
              <span slot="subtitle"> 2017 (c) <a href="https://denisu.xyz">Dennis Russell</a></span>
            </q-card-title>
            <q-card-main>
              <p>Source available on Github under the MIT license.</p>

              <p>Built with Vue and Quasar.</p>
            </q-card-main>
            <q-card-separator />
            <q-card-actions>
              <q-btn flat icon="fa-github" @click="launchURL('https://github.com/rasserudenisu/shimekiri')">Github</q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </q-modal-layout>
    </q-modal>

  </q-layout>
</template>

<script>
import {
  openURL,
  QCard,
  QCardTitle,
  QCardMedia,
  QCardActions,
  QCardSeparator,
  QCardMain,
  QModal,
  QModalLayout,
  QBtn,
  QIcon,
  QLayout,
  QCheckbox,
  QToolbar,
  QToolbarTitle,
  QInput,
  QDatetime,
  QChipsInput,
  QField,
  QList,
  QItem,
  QItemSide,
  QItemMain,
  QItemSeparator,
  QSelect,
  QListHeader
} from 'quasar'
export default {
  components: {
    QCard,
    QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QModal,
    QModalLayout,
    QCheckbox,
    QBtn,
    QIcon,
    QLayout,
    QToolbar,
    QToolbarTitle,
    QInput,
    QDatetime,
    QChipsInput,
    QField,
    QSelect,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
    QListHeader
  },
  data () {
    return {
      fuzzyTime: JSON.parse(this.$localStorage.get('fuzzy', true)),
      languageOptions: [
        {label: 'English', value: 'en'},
        {label: 'Deutsch', value: 'de'},
        {label: '日本語', value: 'ja'}
      ],
      formatOptions: [
        {label: 'Afrikaans', value: 'af'},
        {label: 'Arabic (Algeria)', value: 'ar-dz'},
        {label: 'Arabic (Kuwait)', value: 'ar-kw'},
        {label: 'Arabic (Libya)', value: 'ar-ly'},
        {label: 'Arabic (Morocco)', value: 'ar-ma'},
        {label: 'Arabic (Saudi Arabia)', value: 'ar-sa'},
        {label: 'Arabic (Tunisia)', value: 'ar-tn'},
        {label: 'Arabic', value: 'ar'},
        {label: 'Azerbaijani', value: 'az'},
        {label: 'Belarusian', value: 'be'},
        {label: 'Bulgarian', value: 'bg'},
        {label: 'Bengali', value: 'bn'},
        {label: 'Tibetan', value: 'bo'},
        {label: 'Breton', value: 'br'},
        {label: 'Bosnian', value: 'bs'},
        {label: 'Catalan', value: 'ca'},
        {label: 'Czech', value: 'cs'},
        {label: 'Chuvash', value: 'cv'},
        {label: 'Welsh', value: 'cy'},
        {label: 'Danish', value: 'da'},
        {label: 'German (Austria)', value: 'de-at'},
        {label: 'German (Switzerland)', value: 'de-ch'},
        {label: 'German', value: 'de'},
        {label: 'Maldivian', value: 'dv'},
        {label: 'Greek', value: 'el'},
        {label: 'English (Australia)', value: 'en-au'},
        {label: 'English (Canada)', value: 'en-ca'},
        {label: 'English (Great Britain)', value: 'en-gb'},
        {label: 'English (Ireland)', value: 'en-ie'},
        {label: 'English (New Zealand)', value: 'en-nz'},
        {label: 'English (USA)', value: 'en-us'},
        {label: 'Esperanto', value: 'eo'},
        {label: 'Spanish (Dominican Republic)', value: 'es-do'},
        {label: 'Spanish', value: 'es'},
        {label: 'Estonian', value: 'et'},
        {label: 'Basque', value: 'eu'},
        {label: 'Persian', value: 'fa'},
        {label: 'Finnish', value: 'fi'},
        {label: 'Faroese', value: 'fo'},
        {label: 'French (Switzerland)', value: 'fr-ca'},
        {label: 'French (Canada)', value: 'fr-ch'},
        {label: 'French', value: 'fr'},
        {label: 'Frisian', value: 'fy'},
        {label: 'Scottish Gaelic', value: 'gd'},
        {label: 'Galician', value: 'gl'},
        {label: 'Hebrew', value: 'he'},
        {label: 'Hindi', value: 'hi'},
        {label: 'Croatian', value: 'hr'},
        {label: 'Hungarian', value: 'hu'},
        {label: 'Armenian', value: 'hy-am'},
        {label: 'Indonesian', value: 'id'},
        {label: 'Icelandic', value: 'is'},
        {label: 'Italian', value: 'it'},
        {label: 'Japanese', value: 'ja'},
        {label: 'Javanese', value: 'jv'},
        {label: 'Georgian', value: 'ka'},
        {label: 'Kazakh', value: 'kk'},
        {label: 'Cambodian', value: 'km'},
        {label: 'Kannada', value: 'kn'},
        {label: 'Korean', value: 'ko'},
        {label: 'Kyrgyz', value: 'ky'},
        {label: 'Luxembourgish', value: 'lb'},
        {label: 'Lao', value: 'lo'},
        {label: 'Lithuanian', value: 'lt'},
        {label: 'Latvian', value: 'lv'},
        {label: 'Montenegrin', value: 'me'},
        {label: 'Maori', value: 'mi'},
        {label: 'Macedonian', value: 'mk'},
        {label: 'Malayalam', value: 'ml'},
        {label: 'Marathi', value: 'mr'},
        {label: 'Malay', value: 'ms'},
        {label: 'Burmese', value: 'my'},
        {label: 'Norwegian Bokmål', value: 'nb'},
        {label: 'Nynorsk', value: 'nn'},
        {label: 'Nepalese', value: 'ne'},
        {label: 'Dutch (Belgium)', value: 'nl-be'},
        {label: 'Dutch', value: 'nl'},
        {label: 'Punjabi (India)', value: 'pa-in'},
        {label: 'Polish', value: 'pl'},
        {label: 'Portuguese (Brazil)', value: 'pt-br'},
        {label: 'Portuguese', value: 'pt'},
        {label: 'Romanian', value: 'ro'},
        {label: 'Russian', value: 'ru'},
        {label: 'Sindhi', value: 'sd'},
        {label: 'Northern Sami', value: 'se'},
        {label: 'Sinhalese', value: 'si'},
        {label: 'Slovak', value: 'sk'},
        {label: 'Slovenian', value: 'sl'},
        {label: 'Albanian', value: 'sq'},
        {label: 'Serbian Cyrillic', value: 'sr-cyrl'},
        {label: 'Serbian', value: 'sr'},
        {label: 'Swedish', value: 'sv'},
        {label: 'Swahili', value: 'sw'},
        {label: 'Tamil', value: 'ta'},
        {label: 'Telugu', value: 'te'},
        {label: 'Thai', value: 'th'},
        {label: 'Tagalog (Philippines)', value: 'tl-ph'},
        {label: 'Klingon', value: 'tlh'},
        {label: 'Turkish', value: 'tr'},
        {label: 'Ukranian', value: 'uk'},
        {label: 'Urdu', value: 'ur'},
        {label: 'Uzbek Latin', value: 'uz-latn'},
        {label: 'Uzbek', value: 'uz'},
        {label: 'Vietnamese', value: 'vi'},
        {label: 'Mandarin (China)', value: 'zh-cn'},
        {label: 'Mandarin (Hong Kong)', value: 'zh-hk'},
        {label: 'Mandarin (Taiwan)', value: 'zh-tw'}
      ],
      detailOptions: [
        {
          label: 'Simple',
          value: 'L'
        },
        {
          label: 'Normal',
          value: 'LL'
        },
        {
          label: 'Detailed',
          value: 'LLL'
        },
        {
          label: 'Verbose',
          value: 'LLLL'
        }
      ],
      formatSelect: this.$localStorage.get('dateFormat', 'en-gb'),
      languageSelection: this.$localStorage.get('languageSelection', 'en'),
      detailSelect: this.$localStorage.get('detailSelect', 'LL')
    }
  },
  methods: {
    launchURL (path) {
      openURL(path)
    }
  },
  watch: {
    fuzzyTime: function (value) {
      this.$localStorage.set('fuzzy', JSON.parse(value))
    },
    formatSelect: function (value) {
      this.$localStorage.set('dateFormat', value)
    },
    detailSelect: function (value) {
      this.$localStorage.set('detailSelect', value)
    },
    languageSelection: function (value) {
      this.$localStorage.set('languageSelection', value)
      this.$i18n.locale = value
    }
  }
}
</script>

<style>

</style>

import Vue from 'vue'
import format from 'date-fns/format'
import fromUnixTime from 'date-fns/fromUnixTime'

Vue.filter('dtFormatDate', ts => format(fromUnixTime(ts), 'dd/MM/yy'))
<template>
  <v-container>
    <v-main style="paddingTop: 0">
      <v-row>
        <v-subheader style="paddingLeft: 0">
          Pengeluaran bulan - {{ monthOf | dtFormatDate }}
        </v-subheader>
      </v-row>
      <v-row>
        <template>
          <v-simple-table fixed-header class="simpleTable">
            <template v-slot:default>
              <thead>
                <tr class="simpleTable__tr">
                  <th class="text-left">
                    Time
                  </th>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Harga
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in result" :key="item.id" :class="item.id" >
                  <td>{{ item.createdAt | dtFormatDate }} </td>
                  <td class="item__label">{{ item.label }}</td>
                  <td>
                    <v-chip :color="getColor(item.value)" dark>
                      {{ item.value | digitGrouping }}
                    </v-chip>
                  </td>
                  <td>
                    <v-icon :ref="item.id" color="white" @click.prevent="deleting(item.id)">
                      mdi-trash-can-outline
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
      </v-row>
    </v-main>
    <add-spending></add-spending>
  </v-container>
</template>
<script>
import getUnixTime from 'date-fns/getUnixTime'
import startOfMonth from 'date-fns/startOfMonth';
export default {
  middleware: 'authenticated',
  data: () => ({
        headers: [
          {
            text: 'Pengeluaran',
            align: 'start',
            sortable: false,
            search: null,
            value: 'name',
          },
          { text: '', value: 'label' }
        ],
        isLoading: true,
        result: [],
        monthOf: ''
  }),
  fetch () {
    console.log('fetch jalan weh');
    const { nodeEnv } = this.$config
    const collection = nodeEnv === 'development' ? 'dev-spendings' : 'spendings'
    const now = new Date()
    const start = getUnixTime(startOfMonth(now))
    this.monthOf = start
    this.$fire
        .firestore
        .collection(collection)
        .where('created_at', '>=', start)
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          this.isLoading = false
          snapshot
            .docChanges()
            .forEach((change) => {
              if (change.type === 'added') {
                const {
                  created_at: createdAt,
                  label,
                  user,
                  value
                } = change.doc.data()
                const index = this.result.findIndex(ob => ob.id === change.doc.id);
                if (index < 0) {
                  this.result.push({
                    createdAt,
                    id: change.doc.id,
                    label,
                    user,
                    value
                  })
                }
              } else if (change.type === 'removed') {
                let target = document.getElementsByClassName(change.doc.id)[0];
                target.remove();
              }
            })
        })
  },
  methods: {
    getColor (item) {
      if (item > 50000) return 'red'
      else if (item > 25000) return 'orange'
      else return 'green'
    },
    deleting(item) {
      const _self = this;
      const { nodeEnv } = this.$config
      const db = this.$fire.firestore
      const collection = nodeEnv === 'development' ? 'dev-spendings' : 'spendings'

      try {
        db.collection(collection).doc(item).delete().then(() => {
          console.log('deletion succeed');
        })
      } catch (err) {
        console.log(err.message);
      }
    }
  },
  mounted() {
      const db = this.$fire.firestore
  }
}
</script>

.<style lang="scss" scoped>
.simpleTable {
  width: 100%;
}
.item__label {
  text-transform: capitalize;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 24px;
}
</style>
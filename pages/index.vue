<template>
  <v-container>
    <v-main style="paddingTop: 0">
      <v-row>
        <v-subheader>
          Catatan Pengeluaran {{ result.label }}
        </v-subheader>
      </v-row>
      <v-row>
        <template>
          <v-simple-table fixed-header dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Time
                  </th>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in result" :key="item.id" >
                  <td>{{ item.created_at }}</td>
                  <td>{{ item.label }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
        <!-- <v-data-table
          :headers="headers"
          :items="result"
          class="elevation-1"
          dense
        >
          <template v-slot:item.label="{ item }">
            <v-chip :color="getColor(item.value)" dark>
              {{ item.value }}
            </v-chip>
          </template>
        </v-data-table> -->
      </v-row>
    </v-main>
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
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159
          },
          {
            name: 'Ice cream sandwich',
            calories: 237
          },
          {
            name: 'Eclair',
            calories: 262
          },
          {
            name: 'Cupcake',
            calories: 305
          },
          {
            name: 'Gingerbread',
            calories: 356
          }
        ],
        isLoading: true,
        result: []
  }),
  fetch () {
    const { nodeEnv } = this.$config
    const collection = nodeEnv === 'development' ? 'dev-spendings' : 'spendings'
    const now = new Date()
    const start = getUnixTime(startOfMonth(now))

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
              }
            })
        })
  },
  methods: {
    getColor (item) {
      if (item > 400) return 'red'
      else if (item > 200) return 'orange'
      else return 'green'
    }
  },
  mounted() {
    console.log(this.result);
  }
}
</script>
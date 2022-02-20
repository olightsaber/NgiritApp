<template>
  <v-container>
    <v-row>
      <user-profile></user-profile>
    </v-row>
    <v-row>
      <v-card class="mx-auto" flat>
        <v-navigation-drawer width="100%" permanent>
          <v-list>
            <!-- Profile section -->
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
              </v-list-item-avatar>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    Name: {{ user.displayName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item>
            <!-- [end] Profile section -->
          </v-list>

          <v-divider></v-divider>
          
          <v-list nav dense >
            <v-list-item-group v-model="selectedItem" color="primary" >
              <v-list-item v-for="(item, i) in result" :key="i" >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-h7">{{ item.label }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="text-h7">{{ item.value | digitGrouping }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <br>
            <hr>
            <br>
            <v-row>
              <v-col></v-col>
              <v-col> Total : </v-col>
              <v-col>{{ sumValue | digitGrouping }}</v-col>
            </v-row>
          </v-list>
        </v-navigation-drawer>
        <add-spending></add-spending>
      </v-card>
    </v-row>
    <v-row justify="space-around">
      <v-col cols="auto">
        <v-dialog
          transition="dialog-bottom-transition"
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom dark fab fixed right
              color="primary"
              v-bind="attrs"
              @click="signOut()"
              v-on="on"
            ><v-icon>mdi-logout-variant</v-icon></v-btn>
          </template>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
// import { getFirestore, collection, getDocs } from '@firebase/firestore';
import { getFirestore, doc, onSnapshot, collection } from "firebase/firestore";
import AddSpending from '../../components/AddSpending.vue';
import UserProfile from '../../components/UserProfile.vue';
import { mapState } from 'vuex';
export default {
  components: { AddSpending, UserProfile },
  data: () => ({
    selectedItem: 1,
    result: null,
    sumValue: 0
  }),
  watch: {
    result(newVal) {
      newVal.forEach((res) => {
        this.sumValue += res.value
      })
    }
  },
  computed: {
		...mapState({
			user: state => state.user
		})
	},
  methods: {
    signOut () {
			try {
				this.error = ''
				this.$fire
						.auth
						.signOut()
						.then(() => {
							console.log('sign out succesful');
              this.$nuxt.$router.push('/login')
						})
						.catch((err) => console.log(err.message))
			} catch (error) {
				this.error = {
					message: err.message
				}
			}
		},
    // getting data (real time)
    fetchData() {
      const db = getFirestore();
    }
  },
  mounted() {
    // init service
    // const db = getFirestore();
    // collection ref 
    // const colRef = collection(db, 'dev-spendings');
    // // get collection data
    // getDocs(colRef)
    //   .then((res) => {
    //     let spendings = []
    //     res.docs.forEach((doc) => {
    //       spendings.push({ ...doc.data(), id: doc.id})
    //     })
    //     this.result = spendings
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //   })
    // this.fetchData();
  }
}
</script>
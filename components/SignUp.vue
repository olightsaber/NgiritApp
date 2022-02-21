<template>
	<v-col cols="auto">
		<v-dialog transition="dialog-top-transition" max-width="600" >
			<template v-slot:activator="{ on, signUp }">
				<v-btn
					color="primary"
					v-bind="signUp"
					v-on="on"
				>Sign Up</v-btn>
			</template>
			<template v-slot:default="dialog">
				<v-card>
					<v-toolbar color="primary" dark
					>Howdy, lets register who are you.. </v-toolbar>
					<v-card-text>
						<v-container>
							<v-col class="mx-2">
								<v-text-field
									v-model="nameRegis"
									:counter="10"
									:rules="nameRules"
									label="Name"
									autofocus
								></v-text-field>
								<v-text-field 
									v-model.trim="regisEmail"
									:rules="emailRules"
									:disabled="isProcessing" 
									label="email" 
									type="email"
								/>
								<v-text-field
									v-model.trim="regisPassword"
									:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="[rules.required, rules.min]"
									:type="show1 ? 'text' : 'password'"
									name="input-10-1"
									label="password"
									counter
									@click:append="show1 = !show1"
								></v-text-field>
							</v-col>
						</v-container>
					</v-card-text>
					<v-card-text v-if="error">
						<v-toolbar color="warning" dark >
							{{ error.message }}
						</v-toolbar>
					</v-card-text>
					<v-card-actions>
						<v-spacer />
						<v-btn 
							:loading="isProcessing" 
							color="primary" 
							dark="dark" 
							@click.prevent="regis" 
							:disabled="!regisEmail || !regisPassword"
							>
							Registration
						</v-btn>
					</v-card-actions>
					<v-card-actions class="justify-end">
						<v-btn text @click="dialog.value = false">Close</v-btn>
					</v-card-actions>
				</v-card>
			</template>
		</v-dialog>
	</v-col>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'SignUp',
	data: () => ({
		show1: false,
		isProcessing: false,
    error: '',
		regisEmail: '',
		regisPassword: '',
		nameRegis: '',
		nameRules: [
			v => !!v || 'Name is required',
			v => (v && v.length <= 10) || 'Name must be less than 10 characters',
		],
		emailRules: [
			v => !!v || 'E-mail is required',
			v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
		],
		rules: {
			required: value => !!value || 'Required.',
			min: v => v.length >= 8 || 'Min 8 characters',
			emailMatch: () => (`The email and password you entered don't match`),
		}
	}),
	computed: {
		...mapState({
			user: state => state.user
		})
	},
	watch: {
		user(val) {
      console.log(val, 'val');
			if (val) { this.$router.push('/about')}
		}
	},
	methods: {
		regis() {
			try {
				this.error = ''
				this.isProcessing = true
				this.$fire
					.auth
					.createUserWithEmailAndPassword(this.regisEmail, this.regisPassword)
					.then((userCredential) => {
						const data = userCredential.user
						data.updateProfile({
							displayName: this.nameRegis
						})
					})
					.catch((err) =>{
						this.isProcessing = false;
						this.error = {
							message: err.message
						}
						console.log('message', err.message);
					})
			} catch (error) {
				this.error = {
					message: error.message
				}
				
			}
		}
	},
  mounted() {
    console.log('mounted sign up');
  }
}
</script>
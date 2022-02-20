<template>
	<v-container class="fill-height">
		<!-- Login UI -->
		<v-row justify="center" align="center">
			<v-col cols="auto">
				<v-dialog transition="dialog-top-transition" max-width="600" >
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="primary"
							v-bind="attrs"
							v-on="on"
						>Login</v-btn>
					</template>
					<template v-slot:default="dialog">
						<v-card>
							<v-toolbar
								color="primary"
								dark
							>Howdy, lets see who are you.. </v-toolbar>
							<v-card-text>
								<v-container>
									<v-col class="mx-2">
										<v-text-field 
											v-model.trim="email" 
											:disabled="isProcessing" 
											autofocus 
											label="email" 
											type="email"
											:rules="emailRules"
										/>
										<v-text-field
											v-model="password"
											:append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
											:rules="[rules.required, rules.min]"
											:type="show1 ? 'text' : 'password'"
											name="input-10-1"
											label="hint apa ya"
											counter
											@click:append="show1 = !show1"
										></v-text-field>
									</v-col>
								</v-container>
							</v-card-text>
							<v-card-actions>
								<v-spacer />
								<v-btn :loading="isProcessing" color="primary" dark="dark" @click.prevent="submit">
									Kirim
								</v-btn>
							</v-card-actions>
							<v-card-actions class="justify-end">
								<v-btn
									text
									@click="dialog.value = false"
								>Close</v-btn>
							</v-card-actions>
						</v-card>
					</template>
				</v-dialog>
			</v-col>
			
			<v-icon>
				mdi-arrow-expand-horizontal
			</v-icon>
			
			<!-- Sign Up [email] -->
				<sign-up></sign-up>
			<!-- [end] Sign Up [email] -->
		</v-row>
		<!-- [end] Login UI -->
	</v-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
		email: '',
		password: '',
    error: '',
		isProcessing: false,
		show1: false,
		rules: {
			required: value => !!value || 'Required.',
			min: v => v.length >= 8 || 'Min 8 characters',
			emailMatch: () => (`The email and password you entered don't match`),
		},
		emailRules: [
			v => !!v || 'E-mail is required',
			v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
		]
	}),
	computed: {
		...mapState({
			user: state => state.user
		})
	},
	watch: {
		user(val) {
			if (val) { this.$router.push('/home/MonthlyExpenses')}
		}
	},
	methods: {
		submit() {
			this.signIn();
		},
		reset() {
			this.dialogCreate = false;
			this.error = false;
			this.email = ''
			this.password = ''
			this.isProcessing = false
		},
		signIn () {
			try {
				this.error = ''
				this.isProcessing = true
				this.$fire
				.auth
				.signInWithEmailAndPassword(this.email, this.password)
				.catch((error) => {
					this.isProcessing = false
					this.error = {
						message: error.message
					}
				})
			} catch (err) {
				this.error = {
				message: err.message
			}
		}
    }
	},
	mounted() {
		// check if store already generate user data
		if (this.user) this.$router.push('/')
	}
}
</script>
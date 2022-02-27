<template>
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
            v-on="on"
          ><v-icon>mdi-plus</v-icon></v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-toolbar color="primary" dark>Masukan angka pengeluaranmu</v-toolbar>
            <v-card-text>
							<v-container>
								<v-col class="mx-2">
									<v-text-field v-model.trim="formItem" :disabled="isProcessing" autofocus label="Barang/Jasa" type="text" />
									<v-text-field v-model.trim="formValue" :disabled="isProcessing" label="Harga" type="number" prefix="Rp." />
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
              <v-btn class="closeAddSpending" text @click="dialog.value = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import getUnixTime from 'date-fns/getUnixTime'
export default {
	name: 'AddSpending',
	data: () => ({
		dialogCreate: false,
    error: '',
    formItem: '',
    formValue: '',
    isProcessing: false
	}),
	methods: {
    reset() {
      this.error = false
      this.formItem = ''
      this.formValue = 0
      this.isProcessing = false
    },
    submit() {
      try {
        const _self = this;
        const { nodeEnv } = this.$config
        const collection = nodeEnv === 'development' ? 'dev-spendings' : 'spendings'
        const now = getUnixTime(new Date());
        const exit = document.getElementsByClassName('closeAddSpending')[0];

        this.isProcessing = true;
        this.$fire
          .firestore
          .collection(collection)
          .add({
            label: this.formItem,
            value: parseFloat(this.formValue),
            created_at: now,
            updated_at: now,
            icon: 'mdi-flag',
          })
          .then((docRef) => {
            console.log(docRef, 'docref');
            _self.reset();
            exit.click()
          })
          .catch((error) => {
            console.log(error.message);
          })
      } catch (err) {
        this.error = err.message
      }
    }
  }
}
</script>
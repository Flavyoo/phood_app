<template>
	<div class="Account container-fluid mt-4">
		<h1>Disposed Items</h1>
		<div class="row">
			<div class="Account-sidebarContainer col-md-3">
				<VerticalSide/>
			</div>
			<div class="Account-mainDisplay col-md-6">
				<ul class="Account-itemList">
					<li class="Account-itemList-item" v-for=" item in disposedItems" :key="item.id">
						<ItemCard
							v-bind:itemSubtitle="itemSubtitle(item.company, item.facility)"
							v-bind:otherInfo="getItemWeight(item.currentWeightRecorded)"
							v-bind:item="item"
							@editItem="populateItemData"
							@deleteItem="deleteDisposedItem"
						/>
					</li>
				</ul>
			</div>
			<div class="Account-createItemFormContainer col-md-3">
				<b-card :title="(currentItem.id ? 'Edit Item ID: ' + currentItem.id : 'Add Item')">
					<form @submit.prevent="saveItem">
						<b-form-group label="Title">
							<b-form-input type="text" v-model="currentItem.name"></b-form-input>
						</b-form-group>
						<b-form-group label="Description">
							<b-form-textarea rows="4" v-model="currentItem.description"></b-form-textarea>
						</b-form-group>
						<b-form-group label="Company Name">
							<b-form-input rows="1" v-model="currentItem.company"></b-form-input>
						</b-form-group>
						<b-form-group label="Company Facility">
							<b-form-input rows="1" v-model="currentItem.facility"></b-form-input>
						</b-form-group>
						<b-form-group label="Total Waste">
							<b-form-input rows="1" v-model="currentItem.currentWeightRecorded"></b-form-input>
						</b-form-group>
						<div>
							<b-btn type="submit" variant="success">Save Post</b-btn>
						</div>
					</form>
				</b-card>
			</div>
		</div>
	</div>
</template>

<script>
import VerticalSide from '@/components/VerticalSide'
import ItemCard from '@/components/ItemCard'
import API from '@/api'

export default {
    name: "Account",
	data () {
		return {
			unit: "lbs",
			currentItem: {},
			disposedItems: [],
		}
	},
    components: {
        VerticalSide,
		ItemCard
    },
	async created () {
		this.refreshItems()
	},
	methods: {
		itemSubtitle: function(value1, value2) {
			return value1 + ": " + value2
		},
		getItemWeight: function(weight) {
			return `Total Weight: ${weight} ${this.unit}`
		},
		async refreshItems() {
			this.loading = true
			this.disposedItems = await API.getDisposedItems()
			this.loading = false
		},
		async populateItemData(item) {
			this.currentItem = Object.assign({}, item)
		},
		async saveItem() {
			/*
			 * Check if there is a current item,
			 * and call the udpate method with the model id and model.
			 */
			if (this.currentItem.id) {
				await API.updateDisposedItem(this.currentItem.id, this.currentItem)
			} else {
				await API.createDisposedItem(this.currentItem)
			}
			// reset the form values
			this.currentItem = {}
			await this.refreshItems()
		},
		async deleteDisposedItem(itemId) {
			if (this.currentItem.id === itemId) {
				this.model = {}
			}
			await API.deleteDisposeditem(itemId)
			await this.refreshItems()
		}
	}
}
</script>

<style scoped lang="scss">
.Account {
	&-mainDisplay {
		padding: 0;
		margin: 0;
	}
	&-itemList {
		margin: 0;
		padding: 0;
		&-item {
			list-style-type: none;
			margin: 20px 0 0 20px;
		}
	}
}
</style>

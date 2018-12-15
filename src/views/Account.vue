<template>
	<div class="container-fluid mt-4">
		<div class="row">
			<div class="col-md-3">
				<VerticalSideNavbar/>
			</div>
			<div class="col-md-6">
				<ul class="Item-listConatiner">
					<li v-for=" item in disposedItems" :key="item.id">
						<ItemCard
							itemTitle="item.name"
							itemDescription="item.description"
							itemSubtitle="itemSubtitle(item.company, item.facility)"
							otherInfo="getItemWeight(item.currentWeightRecorded)"
							onDelete="deleteItem(item.id)"
							onEdit="saveItem(item)"
						/>
					</li>
				</ul>
			</div>
			<div class="col-md-3">
				<b-card :title="(currentItem.id ? 'Edit Item ID#' + currentItem.id : 'Add Item')">
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
import VerticalSideNavbar from '@/components/VerticalSideNavbar'
import ItemCard from '@/components/ItemCard'
export default {
    name: "Account",
	data () {
		return {
			unit: "lbs",
			currentItem: {}
		}
	},
    components: {
        VerticalSideNavbar,
		ItemCard
    },
	methods: {
		// concats two values together
		itemSubtitle: function(value1, value2) {
			return value1 + ": " + value2
		},
		getItemWeight: function(weight) {
			return `Total Weight: ${weight} ${this.unit}`
		}
	}
}
</script>

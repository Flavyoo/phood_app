<template>
	<div class="ItemCard card" style="width: 36rem;">
		<div class="card-body">
			<h5 class="card-title">
				<b>Name</b>: {{ item.name }}
			</h5>
			<h6 class="card-subtitle mb-2 text-muted">
				{{ itemSubtitle }}
			</h6>
			<p class="card-text">
				<b>Description</b>: {{ item.description }}
			</p>
			<p class="card-text">{{ otherInfo }}</p>
			<a href="#" @click.prevent="$emit('editItem', item)" class="card-link">Edit</a>
			<a href="#" @click.prevent="$emit('deleteItem', item.id)" class="card-link">Delete</a>
		</div>
	</div>
</template>

<script>
export default {
	name: "ItemCard",
	props: {
		itemSubtitle: String,
		otherInfo: String,
		onDelete: Function,
		onEdit: Function,
		item: Object
	}
}
</script>

<style scoped lang="scss">
.ItemCard {
	box-shadow: 0 14px 28px rgba(0,0,0,0.20), 0 10px 10px rgba(0,0,0,0.22);
	border-radius: 10px;
	&:last-child {
		margin-bottom: 20px;
	}
}
</style>

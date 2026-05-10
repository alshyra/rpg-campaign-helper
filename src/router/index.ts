import type { RouterOptions } from "vue-router";

import CharacterTunnelView from "../views/CharacterTunnelView.vue";
import InventoryView from "../views/InventoryView.vue";
import NotesView from "../views/NotesView.vue";
import PersosView from "../views/PersosView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingsView from "../views/SettingsView.vue";

export const routes: RouterOptions["routes"] = [
  {
    path: "/",
    redirect: "/characters",
  },
  {
    path: "/characters",
    name: "characters",
    component: PersosView,
    meta: { label: "Personnages" },
  },
  {
    path: "/characters/create",
    name: "character-create",
    component: CharacterTunnelView,
    meta: { label: "Créer" },
  },
  {
    path: "/characters/:id/profile",
    name: "character-profile",
    component: ProfileView,
    meta: { label: "Profil" },
  },
  {
    path: "/characters/:id/inventory",
    name: "character-inventory",
    component: InventoryView,
    meta: { label: "Inventaire" },
  },
  {
    path: "/characters/:id/notes",
    name: "character-notes",
    component: NotesView,
    meta: { label: "Notes" },
  },
  {
    path: "/characters/:id/edit",
    name: "character-edit",
    component: CharacterTunnelView,
    meta: { label: "Édition" },
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
    meta: { label: "Paramètres" },
  },
];

export const routerOptions: Pick<RouterOptions, "routes"> = {
  routes,
};

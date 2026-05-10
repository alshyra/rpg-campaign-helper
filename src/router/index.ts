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
    redirect: "/persos",
  },
  {
    path: "/persos",
    name: "persos",
    component: PersosView,
    meta: { label: "Persos" },
  },
  {
    path: "/profil",
    name: "profil",
    component: ProfileView,
    meta: { label: "Profil" },
  },
  {
    path: "/inventaire",
    name: "inventaire",
    component: InventoryView,
    meta: { label: "Inventaire" },
  },
  {
    path: "/notes",
    name: "notes",
    component: NotesView,
    meta: { label: "Notes" },
  },
  {
    path: "/parametres",
    name: "parametres",
    component: SettingsView,
    meta: { label: "Paramètres" },
  },
  {
    path: "/personnage/tunnel",
    name: "character-tunnel",
    component: CharacterTunnelView,
    meta: { label: "Tunnel personnage" },
  },
];

export const routerOptions: Pick<RouterOptions, "routes"> = {
  routes,
};

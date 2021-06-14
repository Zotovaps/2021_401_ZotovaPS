<template>
  <div>
    <v-dialog v-model="editFolder.dialog" max-width="50%">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("$.folders.editFolder_form.header") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editFolder.name_ru"
            :label="$t('$.folders.editFolder_form.name_ru')"
            :readonly="editFolder.loading"
            :rules="rules.name_ru"
          />
          <v-text-field
            v-model="editFolder.name_en"
            :label="$t('$.folders.editFolder_form.name_en')"
            :readonly="editFolder.loading"
            :rules="rules.name_en"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="editFolder.loading"
            flat
            @click="editFolder.dialog = false"
          >
            {{ $t("$.algorithms.newAlgorithm_form.cancel") }}
          </v-btn>
          <v-btn
            color="primary"
            :loading="editFolder.loading"
            @click="editFolderData(item)"
          >
            {{ $t("$.algorithms.editAlgorithm_form.submit") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addFolder.dialog" max-width="75%">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ $t("$.folders.addFolder_form.header") }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-tabs>
            <v-tab>{{ $t("$.folders.addFolder_form.folder") }}</v-tab>
            <v-tab>{{ $t("$.folders.addFolder_form.algorithm") }}</v-tab>

            <v-tab-item>
              <v-text-field
                v-model="addFolder.name_ru"
                :label="$t('$.folders.editFolder_form.name_ru')"
                :readonly="addFolder.loading"
                :rules="rules.name_ru"
              />
              <v-text-field
                v-model="addFolder.name_en"
                :label="$t('$.folders.editFolder_form.name_en')"
                :readonly="addFolder.loading"
                :rules="rules.name_en"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="addFolder.loading"
                  flat
                  @click="addFolder.dialog = false"
                >
                  {{ $t("$.algorithms.newAlgorithm_form.cancel") }}
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="addFolder.loading"
                  @click="addFolderData(item)"
                >
                  {{ $t("$.folders.addFolder_form.submit") }}
                </v-btn>
              </v-card-actions>
            </v-tab-item>
            <v-tab-item>
              <v-select
                v-model="addFolder.selectedAlgorithm"
                :items="parseName(algoItems)"
                label="Standard"
              ></v-select>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="addFolder.loading"
                  flat
                  @click="addFolder.dialog = false"
                >
                  {{ $t("$.algorithms.newAlgorithm_form.cancel") }}
                </v-btn>
                <v-btn
                  color="primary"
                  :loading="addFolder.loading"
                  @click="
                    addAlgorithmData(
                      algoItems,
                      addFolder.selectedAlgorithm,
                      item,
                    )
                  "
                >
                  {{ $t("$.folders.addFolder_form.submit") }}
                </v-btn>
              </v-card-actions>
            </v-tab-item>
          </v-tabs>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-expansion-panel accordion>
      <v-expansion-panel-content>
        <template v-slot:header>
          <div>
            {{ $t("$.language") == "RU" ? item.name.ru : item.name.en }}
          </div>
        </template>

        <v-layout class="pl-4 pb-4">
          <v-icon
            color="error"
            small
            :disabled="!stateUser"
            @click="deleteFolder(item)"
          >
            delete
          </v-icon>
          <v-icon
            class="ml-2"
            :disabled="!stateUser"
            small
            @click="editFolder.dialog = true"
          >
            edit
          </v-icon>
          <v-icon
            class="ml-2"
            :disabled="!stateUser"
            small
            @click="addFolder.dialog = true"
          >
            add
          </v-icon>
        </v-layout>

        <ul v-if="item.malgorithm && item.malgorithm.length > 0">
          <AlgorithmList
            :algorithm-items="item.malgorithm"
            :folder-index="item._id"
          />
        </ul>

        <div class="flex items-center">
          <div>
            <ul
              v-if="item.subFolders && item.subFolders.length > 0"
              class="list-none"
            >
              <FolderRecursion
                v-for="(child, subIndex) in item.subFolders"
                :key="subIndex"
                :item="child"
                :parent-item="item"
                :algo-items="algoItems"
              />
            </ul>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import {Component, State, Vue, Watch} from "nuxt-property-decorator";
import AlgorithmList from "./algorithmList.vue";

@Component({
  name: "FolderRecursion",
  components: {
    AlgorithmList,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    parentItem: {
      required: false,
    },
    algoItems: {
      required: true,
    },
  },
})
export default class FolderRecursion extends Vue {
  public editFolder = {
    dialog: false,
    name_ru: "",
    name_en: "",
    loading: false,
  };

  public addFolder = {
    dialog: false,
    name_ru: "",
    name_en: "",
    loading: false,
    selectedAlgorithm: null,
  };

  @State("user")
  public stateUser!: string;

  public async deleteFolder(folder: any) {
    if (confirm(this.$t("$.folders.deleteConfirm") as string)) {
      await axios.delete(`/folder/${folder._id}`, {
        baseURL: process.env.API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    }
  }

  public async editFolderData(folder: any) {
    this.editFolder.dialog = false;
    await axios.patch(
      `/folder/${folder._id}`,
      {
        name: {
          en: this.editFolder.name_en,
          ru: this.editFolder.name_ru,
        },
      },
      {
        baseURL: process.env.API_ENDPOINT,
        headers: {
          type: "editFolder",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  public async addFolderData(folder: any) {
    this.addFolder.dialog = false;
    // eslint-disable-next-line no-console
    await axios.put(
      `/folder/${folder._id}`,
      {
        malgorithm: [],
        name: {
          en: this.addFolder.name_en,
          ru: this.addFolder.name_ru,
        },
        subFolders: [],
      },
      {
        baseURL: process.env.API_ENDPOINT,
        headers: {
          type: "subFolders",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
  }

  public parseName(algoItems: any) {
    const names: string[] = [];
    algoItems.map((algorithm) => {
      names.push(algorithm.id + " - " + algorithm.name);
    });
    return names;
  }

  public addAlgorithmData(algoItems: any, algorithm: any, folder: any) {
    const algoObj = null;
    // eslint-disable-next-line no-console
    console.log(folder);
    algoItems.map(async (algo) => {
      if (algo.id === algorithm.split(" - ")[0]) {
        this.addFolder.dialog = false;
        // eslint-disable-next-line no-console
        console.log(algo);
        await axios.put(
          `/folder/${folder._id}`,
          {
            index: algo.id,
          },
          {
            baseURL: process.env.API_ENDPOINT,
            headers: {
              type: "malgorithm",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      }
    });
  }

  public get rules() {
    return {
      name_ru: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
      name_en: [(v: string) => !!v || this.$t("$.rules.folderName.required")],
    };
  }
}
</script>

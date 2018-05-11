<template>
  <q-page>
    <q-card color="white" text-color="black" class="padding-20 q-mx-xl q-my-xl" v-if="$q.platform.is.desktop">
      <q-card-title class="font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.LAUNCH')}}
        <q-btn color="warning" slot="right" class="row items-center" @click="hideModal">
          <q-icon name="reply" /> {{$t('CANCEL')}}
        </q-btn>
      </q-card-title>
      <q-card-separator class="q-my-lg bg-999 no-border-top" />
      <div class="row">
        <q-field :error-label="$t('ERR.ERR_10_100_TITLE')" :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-8 font-16 text-four">
          <q-input v-model="p_title" @focus="$v.p_title.$reset()" @blur="$v.p_title.$touch()" :error="$v.p_title.$error" />
        </q-field>
      </div>
      <div class="row">
        <q-field :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_P_TYPE')" class="col-8 font-16 text-four">
          <q-select color="white" v-model="first_type" :options="proposalType" @change="detectChange" @blur="$v.first_type.$touch()" :error="$v.first_type.$error" />
        </q-field>
        <q-field :label-width="2" class="col-8 q-ml-lg font-16 text-four" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change'">
          <q-select v-model="p_selected" :options="councilList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_COUNCIL')" />
        </q-field>
        <q-field class="col-8 font-16 text-four" :label="$t('proposal.SELECT_P_NET')" :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type !== 'new_n' && this.first_type !== null">
          <q-select v-model="p_selected" :options="netList" @change="val => {console.log(val)}" @blur="$v.p_selected.$touch()" :error="$v.p_selected.isSelected" :placeholder="$t('proposal.SELECT_P_NET')" />
        </q-field>
      </div>
      <div class="row">
        <!-- <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TIME')" :label="$t('proposal.SELECT_P_PERIOD')" class="col-4 font-16 text-four">
            <q-datetime min="2018-04-05" v-model="p_time_start" @blur="$v.p_time_start.$touch()" :error="$v.p_time_start.$error" />
          </q-field>
          <span class="self-center col-1 font-16" align="center">{{$t('TO')}}</span> -->
        <q-field :helper="$t('AT_LEAST_7DAY')" :label-width="4" class="col-4 font-16 text-four"  :label="$t('proposal.SELECT_P_PERIOD')">
          <q-datetime :min="tomorrow" v-model="p_time_end" @blur="$v.p_time_end.$touch()" :error="$v.p_time_end.$error" />
        </q-field>
      </div>
    </q-card>
    <q-card color="white" text-color="black" class="row padding-20 margin-top-20" v-if="$q.platform.is.mobile">
      <q-card-title class="col-12 font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.LAUNCH')}}
        <q-btn color="warning" slot="right" class="row items-center" @click="hideModal">
          <q-icon name="reply" /> {{$t('CANCEL')}}
        </q-btn>
      </q-card-title>
      <q-card-separator class="q-my-lg bg-999 no-border-top" />
      <div class="row col-12">
        <q-field :error-label="$t('ERR.ERR_10_100_TITLE')" :label-width="2" :label="$t('proposal.SELECT_P_TITLE')" class="col-12 font-16 text-four">
          <q-input v-model="p_title" @focus="$v.p_title.$reset()" @blur="$v.p_title.$touch()" :error="$v.p_title.$error" />
        </q-field>
      </div>
      <div class="row col-12">
        <q-field :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_P_TYPE')" class="col-12 font-16 text-four">
          <q-select color="white" v-model="first_type" :options="proposalType" @change="detectChange" @blur="$v.first_type.$touch()" :error="$v.first_type.$error" />
        </q-field>
        <q-field :label-width="2" class="col-12 q-ml-lg font-16 text-four" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type === 'change'">
          <q-select v-model="p_selected" :options="councilList" @blur="$v.p_selected.$touch()" :error="$v.p_selected.$error" :placeholder="$t('proposal.SELECT_P_COUNCIL')" />
        </q-field>
        <q-field class="col-12 font-16 text-four" :label="$t('proposal.SELECT_P_NET')" :label-width="2" :error-label="$t('ERR.ERR_REQUIRE_CONTENT')" v-show="this.first_type !== 'new_n' && this.first_type !== null">
          <q-select v-model="p_selected" :options="netList" @change="val => {console.log(val)}" @blur="$v.p_selected.$touch()" :error="$v.p_selected.isSelected" :placeholder="$t('proposal.SELECT_P_NET')" />
        </q-field>
      </div>
      <div class="row col-12">
        <!-- <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TIME')" :label="$t('proposal.SELECT_P_PERIOD')" class="col-4 font-16 text-four">
            <q-datetime min="2018-04-05" v-model="p_time_start" @blur="$v.p_time_start.$touch()" :error="$v.p_time_start.$error" />
          </q-field>
          <span class="self-center col-1 font-16" align="center">{{$t('TO')}}</span> -->
        <q-field :helper="$t('AT_LEAST_7DAY')" :label-width="4" class="col-12 font-16 text-four"  :label="$t('proposal.SELECT_P_PERIOD')">
          <q-datetime :min="tomorrow" v-model="p_time_end" @blur="$v.p_time_end.$touch()" :error="$v.p_time_end.$error" />
        </q-field>
      </div>
    </q-card>

    <q-card class="padding-20 q-mx-xl q-my-xl" v-show="this.first_type !== null" color="white" text-color="black" v-if="$q.platform.is.desktop">
      <q-card-title class="font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.CONTENT')}}
      </q-card-title>
      <q-card-separator class="q-my-lg bg-999 no-border-top" />
      <transition-group appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
  
        <q-card-main key="content" class="row">
          <!-- <q-field v-show="this.first_type !== 'new' && this.first_type !== 'new_n' && this.first_type !== null && this.first_type !== null" :label-width="3" :label="$t('proposal.SELECT_P_TYPE')" class="col-6 font-16" :error-label="$t('ERR.ERR_REQUIRE_DETAIL')">
              <q-select v-model="second_type" :error="$v.second_type.test" :options="this.first_type === 'change' ? proposalType_sec : proposalType_sec_n" />
            </q-field> -->
          <!-- below is new page -->
          <div v-show="this.first_type === 'new'" id="new" class="col-8">
            <div class="row">
              <q-field class="block col-6" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_NUMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input min=7 max=33 type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-6" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="NEW.selected" @blur="$v.NEW.selected.$touch()" :error="$v.NEW.selected.ifEnough" :options="NEW.memberList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-6" label-width="4" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="">
              <q-field class="col-8" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net new page -->
          <div class="col-12" v-show="this.first_type === 'new_n'" id="new">
            <div class="row">
              <q-field class="block col-6 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_16')" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input type="text" v-model="NEW.name" @blur="$v.NEW.name.$touch()" :error="$v.NEW.name.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-6 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
                <q-input :float-label="$t('LAUNCH_MODAL.NET_NEW_LABEL')" upper-case type="text" v-model="NEW.currency" @blur="$v.NEW.currency.$touch()" :error="$v.NEW.currency.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-6 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
                <q-input upper-case type="number" v-model="NEW.currencyPrecision" @blur="$v.NEW.currencyPrecision.$touch()" :error="$v.NEW.currencyPrecision.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-6 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input type="text" v-model="NEW.currencyBrief" @blur="$v.NEW.currencyBrief.$touch()" :error="$v.NEW.currencyBrief.$error"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="block col-6 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_33')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <!-- <div class="row">
                <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="NEW.selected" :options="NEW.memberList"></q-select>
                </q-field>
            </div> -->
            <div class="row">
              <q-field class="col-6 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-6 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net init page -->
          <!-- TODO -->
          <div class="col-12" v-show="this.first_type === 'init' && this.initFalse" id="init">
            <div class="row">
              <q-field class="col-8 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_SUGGEST_PRE')">
                <q-select chips-color="secondary" chips multiple filter v-model="INIT.selected" @input="detectChange" :suffix="$t('LAUNCH_MODAL.MEMBER_SUGGEST_POST', {number: gatewayMember})" @blur="$v.INIT.selected.$touch()" :error="!$v.INIT.selected.inNeed" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-8 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.INIT_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
          <!-- below is net init disabled page -->
          <div class="col-12" v-show="this.first_type === 'init' && !this.initFalse">
            <div class="row">{{$t('ALREADY_INIT')}}</div>
          </div>
  
          <!-- below is net period page -->
          <div class="col-12" v-show="this.first_type === 'period_n'" id="remove">
            <div class="row">
              <q-field :label-width="4" :label="$t('LAUNCH_MODAL.NET_PERIOD')" class="col-3 font-16 text-four">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre" />
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl font-16 text-four" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net member page -->
          <div class="col-12 q-field-label-inner-center" v-show="this.first_type === 'member_n'" id="remove">
            <!-- instead members -->
            <div class="row">
              <q-field align="left" class="col-4 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP1')">
                <q-select align="center" chips filter v-model="MEMBER.removed" :options="MEMBER.electedList"></q-select>
              </q-field>
              <q-field class="col-4 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP2')">
                <q-select align="center" color="secondary" chips filter v-model="MEMBER.added" :options="MEMBER.unelectedList"></q-select>
              </q-field>
              <q-field class="col-4 font-16 text-four" label-width="8" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP3')">
              </q-field>
            </div>
            <!-- <div class="row justify-around q-my-lg">
                <q-chips-input color="white" :float-label="$t('LAUNCH_MODAL.INSTEAD_PRE')" chips-bg-color="secondary" class="col-5 font-16 padding-20 text-black no-shadow border-secondary chips-input-color" inverted readonly v-model="totalName" disable/>
                <q-icon size="33px" name="keyboard arrow right" />
                <q-chips-input color="white" chips-bg-color="secondary"  :float-label="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5 font-16 padding-20 text-black no-shadow border-secondary chips-input-color" inverted readonly v-model="afterName" disable/>
              </div> -->
            <div class="">
              <q-field class="col-12 font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.MEMBER_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is remove page -->
          <div class="col-12" v-show="this.second_type === 'remove' && this.first_type === 'change'" id="remove">
            <div class="">
              <q-field class="font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is period page -->
          <div class="col-12" v-show="this.second_type === 'period' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :label="$t('proposal.SELECT_P_PERIOD')" class="col-3 font-16 text-four">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre" />
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl font-16 text-four" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is member page -->
          <div class="col-12" v-show="this.second_type === 'member' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3 font-16 text-four">
                <q-select v-model="MEMBER.type_selected" @blur="$v.MEMBER.instead_post.$touch()" :error="$v.MEMBER.instead_post.$error" :options="MEMBER.type" />
              </q-field>
            </div>
            <!-- below are second clues -->
            <!-- add members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'add'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.add_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- delete members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'delete'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.delete_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- instead members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'instead'">
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_PRE')">
                <q-select chips multiple filter v-model="MEMBER.instead_pre" :options="MEMBER.memberList"></q-select>
              </q-field>
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_POST')">
                <q-select chips multiple filter v-model="MEMBER.instead_post" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row justify-around q-my-lg">
              <q-chips-input color="secondary" :prefix="$t('LAUNCH_MODAL.INSTEAD_PRE')" class="col-5" inverted readonly v-model="MEMBER.show_pre" disable/>
              <q-icon size="33px" name="keyboard arrow right" />
              <q-chips-input color="secondary" :prefix="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5" inverted readonly v-model="MEMBER.show_post" disable/>
            </div>
          </div>
          <div class="row col-12" v-show="this.first_type !== null">
            <q-field v-if="secondSignature" class="col-6 font-16 text-four" :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="3">
              <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
            </q-field>
          </div>
        </q-card-main>
  
        <q-card-main v-show="this.first_type !== null" key="agreement">
          <q-checkbox color="secondary" v-model="agreeOptions" val="one" :label="$t('LAUNCH_MODAL.READ_TIP1')" />
          <br><br>
          <q-checkbox color="secondary" v-model="agreeOptions" val="two" :label="$t('LAUNCH_MODAL.READ_TIP2')" />
          <div class="row justify-center">
            <q-btn color="secondary" class="col-4" size="md" @click="launchProposal" :label="$t('proposal.BTN_LAUNCH')" :disabled='this.disableLaunch'></q-btn>
          </div>
        </q-card-main>
      </transition-group>
    </q-card>
    <q-card class="row padding-20 margin-top-20" v-show="this.first_type !== null" color="white" text-color="black"  v-if="$q.platform.is.mobile">
      <q-card-title class="col-12 font-22 padding-l-0">
        <q-icon size="18px" name="border color" /> {{$t('proposal.CONTENT')}}
      </q-card-title>
      <q-card-separator class="col-12 q-my-lg bg-999 no-border-top" />
      <transition-group class="col-12" appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">

        <q-card-main key="content" class="row col-12">
          <!-- <q-field v-show="this.first_type !== 'new' && this.first_type !== 'new_n' && this.first_type !== null && this.first_type !== null" :label-width="3" :label="$t('proposal.SELECT_P_TYPE')" class="col-6 font-16" :error-label="$t('ERR.ERR_REQUIRE_DETAIL')">
              <q-select v-model="second_type" :error="$v.second_type.test" :options="this.first_type === 'change' ? proposalType_sec : proposalType_sec_n" />
            </q-field> -->
          <!-- below is new page -->
          <div v-show="this.first_type === 'new'" id="new" class="col-12">
            <div class="row col-12">
              <q-field class="block col-12" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_NUMBER')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input min=7 max=33 type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="col-12" label-width="4" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="NEW.selected" @blur="$v.NEW.selected.$touch()" :error="$v.NEW.selected.ifEnough" :options="NEW.memberList"></q-select>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="col-12" label-width="4" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="col-12">
              <q-field class="col-12" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net new page -->
          <div class="col-12" v-show="this.first_type === 'new_n'" id="new">
            <div class="row col-12">
              <q-field class="block col-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_16')" :label="$t('LAUNCH_MODAL.NET_NAME')">
                <q-input type="text" v-model="NEW.name" @blur="$v.NEW.name.$touch()" :error="$v.NEW.name.$error"></q-input>
              </q-field>
            </div>
            <div class="row col-12" >
              <q-field class="block col-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.NET_CURRENCY_TIP')" :label="$t('LAUNCH_MODAL.NET_CURRENCY')">
                <q-input :float-label="$t('LAUNCH_MODAL.NET_NEW_LABEL')" upper-case type="text" v-model="NEW.currency" @blur="$v.NEW.currency.$touch()" :error="$v.NEW.currency.$error"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="block col-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.PRECISION_TIP')" :label="$t('PRECISION')">
                <q-input upper-case type="number" v-model="NEW.currencyPrecision" @blur="$v.NEW.currencyPrecision.$touch()" :error="$v.NEW.currencyPrecision.$error"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="block col-12 font-16 text-four" label-width="3" :error-label="$t('LAUNCH_MODAL.CURRENCY_BRIEF_TIP')" :label="$t('LAUNCH_MODAL.CURRENCY_BRIEF')">
                <q-input type="text" v-model="NEW.currencyBrief" @blur="$v.NEW.currencyBrief.$touch()" :error="$v.NEW.currencyBrief.$error"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="block col-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_3_33')" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-input type="number" v-model="NEW.memberNumber" @blur="$v.NEW.memberNumber.$touch()" :error="$v.NEW.memberNumber.$error" :suffix="$t('LAUNCH_MODAL.PERSON')"></q-input>
              </q-field>
            </div>
            <!-- <div class="row">
                <q-field class="col-8" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_NUMBER')">
                <q-select chips multiple filter v-model="NEW.selected" :options="NEW.memberList"></q-select>
                </q-field>
            </div> -->
            <div class="row col-12">
              <q-field class="col-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_1_30')" :label="$t('LAUNCH_MODAL.PERIOD_NET')">
                <q-input type="number" v-model="NEW.period" @blur="$v.NEW.period.$touch()" :error="$v.NEW.period.$error" :suffix="$t('LAUNCH_MODAL.DAY')"></q-input>
              </q-field>
            </div>
            <div class="row col-12">
              <q-field class="col-12 font-16 text-four" label-width="3" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.BRIEF')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net init page -->
          <!-- TODO -->
          <div class="col-12" v-show="this.first_type === 'init' && this.initFalse" id="init">
            <div class="row col-12">
              <q-field class="col-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_REQUIRE_MEMBER')" :label="$t('LAUNCH_MODAL.MEMBER_SUGGEST_PRE')">
                <q-select chips-color="secondary" chips multiple filter v-model="INIT.selected" @input="detectChange" :suffix="$t('LAUNCH_MODAL.MEMBER_SUGGEST_POST', {number: gatewayMember})" @blur="$v.INIT.selected.$touch()" :error="!$v.INIT.selected.inNeed" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-12 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.INIT_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
          <!-- below is net init disabled page -->
          <div class="col-12" v-show="this.first_type === 'init' && !this.initFalse">
            <div class="row">{{$t('ALREADY_INIT')}}</div>
          </div>
  
          <!-- below is net period page -->
          <div class="col-12" v-show="this.first_type === 'period_n'" id="remove">
            <div class="row">
              <q-field :label-width="4" :label="$t('LAUNCH_MODAL.NET_PERIOD')" class="col-3 font-16 text-four">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre" />
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl font-16 text-four" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is net member page -->
          <div class="col-12 q-field-label-inner-center" v-show="this.first_type === 'member_n'" id="remove">
            <!-- instead members -->
            <div class="row col-12">
              <q-field align="left" class="col-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP1')">
                <q-select align="center" chips filter v-model="MEMBER.removed" :options="MEMBER.electedList"></q-select>
              </q-field>
              <q-field class="col-12 font-16 text-four" label-width="3" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP2')">
                <q-select align="center" color="secondary" chips filter v-model="MEMBER.added" :options="MEMBER.unelectedList"></q-select>
              </q-field>
              <q-field class="col-12 font-16 text-four" label-width="8" :label="$t('LAUNCH_MODAL.REMOVE_COUNCIL_TIP3')">
              </q-field>
            </div>
            <!-- <div class="row justify-around q-my-lg">
                <q-chips-input color="white" :float-label="$t('LAUNCH_MODAL.INSTEAD_PRE')" chips-bg-color="secondary" class="col-5 font-16 padding-20 text-black no-shadow border-secondary chips-input-color" inverted readonly v-model="totalName" disable/>
                <q-icon size="33px" name="keyboard arrow right" />
                <q-chips-input color="white" chips-bg-color="secondary"  :float-label="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5 font-16 padding-20 text-black no-shadow border-secondary chips-input-color" inverted readonly v-model="afterName" disable/>
              </div> -->
            <div class="col-12">
              <q-field class="col-12 font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.MEMBER_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is remove page -->
          <div class="col-12" v-show="this.second_type === 'remove' && this.first_type === 'change'" id="remove">
            <div class="">
              <q-field class="font-16 text-four" label-width="1" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.REMOVE_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.brief.$touch()" :error="$v.brief.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is period page -->
          <div class="col-12" v-show="this.second_type === 'period' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :label="$t('proposal.SELECT_P_PERIOD')" class="col-3 font-16 text-four">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" disabled readonly v-model="PERIOD.pre" />
              </q-field>
              <span class="self-center q-ml-lg">{{$t('LAUNCH_MODAL.INSTEAD_POST')}}</span>
              <q-field class="col-3 q-ml-xl font-16 text-four" :error-label="$t('ERR.ERR_1_30')">
                <q-input :suffix="$t('LAUNCH_MODAL.DAY')" type="number" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" v-model="PERIOD.post" />
              </q-field>
            </div>
            <div class="row">
              <q-field class="col-9 font-16 text-four" label-width="2" :error-label="$t('ERR.ERR_50_1000')" :label="$t('LAUNCH_MODAL.PERIOD_REASON')">
                <q-input type="textarea" v-model="brief" @blur="$v.PERIOD.post.$touch()" :error="$v.PERIOD.post.$error" :placeholder="$t('LAUNCH_MODAL.BRIEF_TIP')"></q-input>
              </q-field>
            </div>
          </div>
  
          <!-- below is member page -->
          <div class="col-12" v-show="this.second_type === 'member' && this.first_type === 'change'" id="remove">
            <div class="row">
              <q-field :label-width="4" :error-label="$t('ERR.ERR_REQUIRE_TYPE')" :label="$t('proposal.SELECT_MEMBER_ACTION')" class="col-3 font-16 text-four">
                <q-select v-model="MEMBER.type_selected" @blur="$v.MEMBER.instead_post.$touch()" :error="$v.MEMBER.instead_post.$error" :options="MEMBER.type" />
              </q-field>
            </div>
            <!-- below are second clues -->
            <!-- add members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'add'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.add_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- delete members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'delete'">
              <q-field class="col-8 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.MEMBER_MEMBER')">
                <q-select chips multiple filter v-model="MEMBER.delete_selected" :options="MEMBER.memberList"></q-select>
              </q-field>
            </div>
            <!-- instead members -->
            <div class="row" v-show="this.MEMBER.type_selected === 'instead'">
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_PRE')">
                <q-select chips multiple filter v-model="MEMBER.instead_pre" :options="MEMBER.memberList"></q-select>
              </q-field>
              <q-field class="col-4 font-16 text-four" label-width="2" :label="$t('LAUNCH_MODAL.INSTEAD_POST')">
                <q-select chips multiple filter v-model="MEMBER.instead_post" :options="delegateList"></q-select>
              </q-field>
            </div>
            <div class="row justify-around q-my-lg">
              <q-chips-input color="secondary" :prefix="$t('LAUNCH_MODAL.INSTEAD_PRE')" class="col-5" inverted readonly v-model="MEMBER.show_pre" disable/>
              <q-icon size="33px" name="keyboard arrow right" />
              <q-chips-input color="secondary" :prefix="$t('LAUNCH_MODAL.INSTEAD_POST')" class="col-5" inverted readonly v-model="MEMBER.show_post" disable/>
            </div>
          </div>
          <div class="row col-12" v-show="this.first_type !== null">
            <q-field v-if="secondSignature" class="col-6 font-16 text-four" :label="$t('TRS_TYPE_SECOND_PASSWORD')+':'" :label-width="3">
              <q-input v-model="secondPwd" type="password" @blur="$v.secondPwd.$touch" :error-label="$t('ERR_TOAST_SECONDKEY_WRONG')" :error="$v.secondPwd.$error" />
            </q-field>
          </div>
        </q-card-main>
  
        <q-card-main v-show="this.first_type !== null" key="agreement">
          <q-checkbox color="secondary" v-model="agreeOptions" val="one" :label="$t('LAUNCH_MODAL.READ_TIP1')" />
          <br><br>
          <q-checkbox color="secondary" v-model="agreeOptions" val="two" :label="$t('LAUNCH_MODAL.READ_TIP2')" />
          <div class="row justify-center margin-top-20">
            <q-btn color="secondary" class="col-4" size="md" @click="launchProposal" :label="$t('proposal.BTN_LAUNCH')" :disabled='this.disableLaunch'></q-btn>
          </div>
        </q-card-main>
      </transition-group>
    </q-card>
  </q-page>
</template>

<script>
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import { secondPwd, proposalTitleReg, assetSymbolReg, gatewayNameReg } from '../utils/validators'
import { toastError, toast } from '../utils/util'
import {
  QField,
  QModal,
  QInput,
  QCard,
  QCardMain,
  QCardTitle,
  QCardSeparator,
  QSelect,
  QCheckbox,
  QDatetime,
  QChipsInput,
  QIcon,
  QPage,
  QBtn,
  date
} from 'quasar'

let tomorrow = date.addToDate(new Date(), {
  days: 1
})
export default {
  name: 'ProposalLaunch',
  components: {
    QField,
    QModal,
    QInput,
    QCard,
    QCardMain,
    QCardTitle,
    QCardSeparator,
    QSelect,
    QCheckbox,
    QDatetime,
    QChipsInput,
    QIcon,
    QPage,
    QBtn
  },
  props: ['show'],
  data() {
    return {
      secondPwd: '',
      // overall setting
      p_title: null,
      first_type: null,
      p_time_start: null,
      p_time_end: null,
      p_selected: {
        name: ''
      },
      second_type: null,
      // cannot init
      // TODO NEED DELETE BELOW
      initFalse: true,
      agreeOptions: [],
      // options for total
      proposalType: [
        // protential of council options
        // {
        //   label: this.$t('proposal.SELECT_NEWCOUNCIL'),
        //   value: 'new'
        // },
        // {
        //   label: this.$t('proposal.SELECT_CHANGECOUNCIL'),
        //   value: 'change'
        // },
        {
          label: this.$t('proposal.SELECT_NEWNET'),
          value: 'new_n'
        },
        // {
        //   label: this.$t('proposal.SELECT_CHANGENET'),
        //   value: 'change_n'
        // },
        {
          label: this.$t('proposal.SELECT_INITNET'),
          value: 'init'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEMEMBER'),
          value: 'member_n'
        }
        // {
        //   label: this.$t('proposal.SELECT_NETPERIOD'),
        //   value: 'period_n'
        // },
        // {
        //   label: this.$t('proposal.SELECT_NETMEMBER'),
        //   value: 'member_n'
        // }
      ],
      proposalType_sec: [
        {
          label: this.$t('proposal.SELECT_REMOVECOUNCIL'),
          value: 'remove'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEPERIOD'),
          value: 'period'
        },
        {
          label: this.$t('proposal.SELECT_CHANGEMEMBER'),
          value: 'member'
        }
      ],
      proposalType_sec_n: [
        // protential canceled
        // {
        //   label: this.$t('proposal.SELECT_NETPERIOD'),
        //   value: 'period_n'
        // },
        {
          label: this.$t('proposal.SELECT_INITNET'),
          value: 'init'
        },
        {
          label: this.$t('proposal.SELECT_NETMEMBER'),
          value: 'member_n'
        }
      ],
      councilList: [],
      netList: [
        // {
        //   label: 'bitcoin',
        //   value: 'bitcoin'
        // },
        // {
        //   label: 'ethereum',
        //   value: 'ethereum'
        // }
      ],
      delegateList: [],
      brief: null,
      NEW: {
        memberList: [],
        memberNumber: null,
        selected: [],
        period: null,
        agreement: [],
        // NET SCOPE
        name: null,
        currency: null,
        currencyBrief: null,
        currencyPrecision: null
      },
      INIT: {
        selected: []
      },
      REMOVE: {},
      PERIOD: {
        pre: null,
        post: null
      },
      MEMBER: {
        type: [
          {
            label: this.$t('proposal.SELECT_MEMBER_ADD'),
            value: 'add'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_DELETE'),
            value: 'delete'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_INSTEAD'),
            value: 'instead'
          }
        ],
        type_selected: null,
        added: [],
        removed: [],
        electedList: [],
        unelectedList: [],
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: []
      },
      tomorrow
    }
  },
  validations: {
    secondPwd: {
      secondPwd: secondPwd()
    },
    p_title: {
      required,
      isTested(val) {
        return proposalTitleReg.test(val)
      }
    },
    first_type: {
      required
    },
    p_selected: {
      required,
      isSelected() {
        if (this.first_type === 'init' || this.first_type === 'member_n') {
          if (this.$v.p_selected.$dirty !== false) {
            return false
          }
          return true
        }
        return false
      }
    },
    p_time_start: {
      required
    },
    p_time_end: {
      required
    },
    brief: {
      required,
      minLength: minLength(50),
      maxLength: maxLength(1000)
    },
    second_type: {
      test(val) {
        if (
          this.first_type !== 'new' &&
          this.first_type !== 'new_n' &&
          this.first_type !== null &&
          this.$v.second_type.$dirty !== false
        ) {
          if (val === null) {
            return true
          }
          return false
        }
        return false
      }
    },
    NEW: {
      memberNumber: {
        required,
        minValue: minValue(3),
        maxValue: maxValue(33)
      },
      selected: {
        required,
        ifEnough(val) {
          // to see whether should use the
          if (this.NEW.memberNumber !== val.length && this.$v.NEW.selected.$dirty !== false) {
            return true
          }
          return false
        }
      },
      period: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(30)
      },
      // NET SCOPE
      name: {
        required,
        reg(val) {
          return gatewayNameReg.test(val)
        }
      },
      currency: {
        required,
        reg(val) {
          return assetSymbolReg.test(val)
        }
      },
      currencyPrecision: {
        required,
        minValue: minValue(0),
        maxValue: maxValue(16)
      },
      currencyBrief: {
        required
      }
    },
    INIT: {
      selected: {
        required,
        inNeed(val) {
          if (this.gatewayMember === val.length) {
            return true
          }
          return false
        }
      }
    },
    PERIOD: {
      post: {
        required,
        minValue: minValue(1),
        maxValue: maxValue(30)
      }
    },
    MEMBER: {
      instead_post: {
        required
      },
      added: {
        required,
        isEqual(val) {
          return val.length === this.MEMBER.removed.length
        }
      },
      removed: {
        required,
        isEqual(val) {
          return val.length === this.MEMBER.added.length
        }
      }
    },
    REMOVE: {}
  },
  mounted() {},
  methods: {
    ...mapActions(['postProposal', 'getGateways', 'getGatewayDelegates']),
    hideModal() {
      this.resetHeader()
      this.resetDetail()
      this.$v.$reset()
      this.$router.back()
    },
    initInfo() {},
    // compile the proposal content
    compileContent() {
      let content = {}
      if (this.first_type === 'new_n') {
        // launch a new gateway
        this.p_desc = this.brief
        content = {
          name: this.NEW.name,
          desc: this.NEW.currencyBrief,
          updateInterval: this.countedInterval,
          minimumMembers: this.NEW.memberNumber,
          currency: {
            symbol: this.NEW.currency,
            desc: this.NEW.currencyBrief,
            precision: this.NEW.currencyPrecision
          }
        }
      } else if (this.first_type === 'init') {
        this.p_desc = ''
        content = {
          // TODO need get gateway detail & members detail
          gateway: this.p_selected.name,
          members: this.INIT.selected,
          desc: this.brief
        }
      } else if (this.first_type === 'member_n') {
        this.p_desc = this.brief
        content = {
          // TODO need getway member list
          gateway: this.p_selected.name,
          from: this.MEMBER.removed.address,
          to: this.MEMBER.added.address
        }
      } else if (this.first_type === 'init') {
        this.p_desc = ''
        content = {
          // TODO need get gateway detail & members detail
          gateway: this.p_selected.name,
          members: this.INIT.selected,
          desc: this.brief
        }
      } else if (this.first_type === 'member_n') {
        this.p_desc = this.brief
        content = {
          // TODO need getway member list
          gateway: this.p_selected.name,
          from: this.beforeAddress,
          to: this.afterAddress
        }
      }
      return content
    },
    async launchProposal() {
      debugger
      // if (this.first_type === 'new' || this.first_type === 'new_n') {
      let valid = this.checkValidate(this.first_type)
      if (!valid) {
        toastError(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
        return
      }
      // } else {
      //   let result = this.checkValidate(this.second_type)
      //   if (!result) {
      //     toastError(this.$t('LAUNCH_MODAL.ERR_INVALID_FORM'))
      //     return
      //   }
      // }
      let obj = {}
      obj.content = this.compileContent()
      obj.title = this.p_title
      obj.desc = this.brief
      obj.topic = this.countedType
      obj.endHeight = this.endHeight
      obj.secondPwd = this.secondPwd
      let result = await this.postProposal(obj)
      if (result.success) {
        toast(this.$t('LAUNCH_MODAL.LAUNCH_SUCCESS'))
        this.hideModal()
      } else {
        toastError(result.error)
      }
    },
    // select component change func
    detectChange() {},
    // info get funcs
    async getAllGate() {
      let res = await this.getGateways()
      let ls = []
      res.gateways.forEach(o => {
        return ls.push({
          label: o.name,
          value: o
        })
      })
      this.netList = ls
    },
    async getAllDelegates() {
      // params :  filter
      // 0 for none elected
      // 1 for elected
      // 2 for all
      // params : obj for the state this response to replace
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      return res
    },
    // to form init list
    async formInitList() {
      let that = this
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      let ls = []
      this.initFalse = true
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 1) {
          that.initFalse = false
          return
        }
        return ls.push({
          label: o.address,
          value: o.address
        })
      })
      this.delegateList = ls
    },
    async formMemberList() {
      let res = await this.getGatewayDelegates({
        name: this.p_selected.name
      })
      let total = []
      let elected = []
      let unelected = []
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 1) {
          return elected.push({
            label: o.name,
            value: o
          })
        }
      })
      res.validators.forEach(o => {
        // cannot init detect
        if (o.elected === 0) {
          return unelected.push({
            label: o.name,
            value: o
          })
        }
      })
      res.validators.forEach(o => {
        return total.push({
          label: o.name,
          value: o
        })
      })
      this.MEMBER.electedList = elected
      this.MEMBER.unelectedList = unelected
      this.delegateList = total
    },
    checkValidate(action) {
      debugger
      // total set first
      if (
        !this.$v.p_title.$invalid &&
        !this.$v.first_type.$invalid &&
        !this.$v.p_time_end.$invalid
      ) {
        switch (action) {
          // init gateway
          case 'init':
            if (
              !this.$v.p_selected.isSelected &&
              !this.$v.INIT.selected.$invalid &&
              this.$v.INIT.selected.inNeed &&
              !this.$v.brief.$invalid
            ) {
              return true
            }
            return false
          // change member of gateway
          case 'member_n':
            if (
              !this.$v.p_selected.isSelected &&
              // !this.$v.MEMBER.instead_post.$invalid &&
              !this.$v.brief.$invalid &&
              this.$v.MEMBER.added.isEqual &&
              this.$v.MEMBER.removed.isEqual
            ) {
              return true
            }
            return false
          // new gateway proposalundefined
          case 'new_n':
            if (
              !this.$v.NEW.name.$invalid &&
              !this.$v.NEW.currency.$invalid &&
              !this.$v.NEW.currencyPrecision.$invalid &&
              !this.$v.NEW.currencyBrief.$invalid &&
              !this.$v.NEW.memberNumber.$invalid &&
              !this.$v.NEW.period.$invalid &&
              !this.$v.brief.$invalid
            ) {
              return true
            }
            return false
        }
      }
      return false
    },
    resetHeader() {
      this.p_title = null
      this.first_type = null
      this.p_time_start = null
      this.p_time_end = null
      this.p_selected = {
        name: ''
      }
      this.secondPwd = ''
    },
    resetDetail() {
      this.initFalse = false
      this.councilList = []
      this.netList = []
      this.delegateList = []
      this.brief = null
      this.NEW = {
        memberList: [],
        memberNumber: null,
        selected: [],
        period: null,
        agreement: [],
        name: null,
        currency: null,
        currencyBrief: null,
        currencyPrecision: null
      }
      this.INIT = {
        selected: []
      }
      this.PERIOD = {
        pre: null,
        post: null
      }
      this.MEMBER = {
        type: [
          {
            label: this.$t('proposal.SELECT_MEMBER_ADD'),
            value: 'add'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_DELETE'),
            value: 'delete'
          },
          {
            label: this.$t('proposal.SELECT_MEMBER_INSTEAD'),
            value: 'instead'
          }
        ],
        type_selected: null,
        added: [],
        removed: [],
        electedList: [],
        unelectedList: [],
        add_selected: [],
        delete_selected: [],
        instead_pre: [],
        instead_post: [],
        memberList: [],
        show_pre: [],
        show_post: []
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    secondSignature() {
      return this.userInfo ? this.userInfo.account.secondPublicKey : null
    },
    countedType() {
      if (this.first_type === 'new_n') {
        return 'gateway_register'
      } else if (this.first_type === 'init') {
        return 'gateway_init'
      } else if (this.first_type === 'period_n') {
        return 'gateway_period'
      } else if (this.first_type === 'member_n') {
        return 'gateway_update_member'
      }
    },
    endHeight() {
      let currentHeight = this.userInfo.latestBlock.height
      let pre = new Date().getTime()
      let post = new Date(this.p_time_end).getTime()
      let shift = (post - pre) / 10000
      return Math.round(currentHeight + shift)
    },
    countedInterval() {
      return Number(this.NEW.period) * 8640
    },
    disableLaunch() {
      if (this.agreeOptions.length === 2) {
        return false
      }
      return true
    },
    totalName() {
      let name = []
      if (this.delegateList && this.delegateList.length > 0) {
        this.MEMBER.electedList.forEach(o => {
          return name.push(o.label)
        })
      }
      return name
    },
    afterList() {
      let space = []
      let removenamespace = []
      if (this.MEMBER.electedList.length > 0 && this.MEMBER.removed.length > 0) {
        this.MEMBER.removed.forEach(o => {
          return removenamespace.push(o.name)
        })
        this.MEMBER.electedList.forEach(o => {
          if (this._.indexOf(removenamespace, o.label) < 0) {
            // not found:
            return space.push(o)
          }
        })
      }
      if (this.MEMBER.electedList.length > 0 && this.MEMBER.added.length > 0) {
        this.MEMBER.added.forEach(o => {
          space.push({
            label: o.name,
            value: o
          })
        })
      }
      return space
    },
    afterName() {
      let name = []
      if (this.afterList.length > 0) {
        this.afterList.forEach(o => {
          return name.push(o.label)
        })
      }
      return name
    },
    beforeAddress() {
      let add = []
      this.MEMBER.electedList.forEach(o => {
        return add.push(o.value.address)
      })
      return add.join(',')
    },
    afterAddress() {
      let add = []
      if (this.afterList.length > 0) {
        this.afterList.forEach(o => {
          return add.push(o.value.address)
        })
      }
      return add.join(',')
    },
    gatewayMember() {
      if (this.p_selected && this.p_selected.minimumMembers) {
        return this.p_selected.minimumMembers
      }
      return 0
    }
  },
  watch: {
    first_type(val) {
      if (val === 'init' || val === 'member_n') {
        this.getAllGate()
      }
    },
    p_selected(val) {
      if (this.first_type === 'init') {
        this.formInitList()
      } else if (this.first_type === 'member_n') {
        this.formMemberList()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.no-border-top {
  margin-top: 0 !important;
}
</style>
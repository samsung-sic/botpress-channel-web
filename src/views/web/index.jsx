/* global: window */

import React from 'react'
import classnames from 'classnames'

// import { Emoji } from 'emoji-mart'

import addMilliseconds from 'date-fns/add_milliseconds'
import isBefore from 'date-fns/is_before'
import queryString from 'query-string'

import Convo from './convo'
import Side from './side'

import style from './style.scss'

if (!window.location.origin) {
  window.location.origin =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
}

const BOT_HOSTNAME = window.location.origin
const ANIM_DURATION = 300

const MIN_TIME_BETWEEN_SOUNDS = 10000 // 10 seconds

const defaultOptions = {
  locale: 'en-US',
  botName: 'Bot',
  backgroundColor: '#ffffff',
  textColorOnBackground: '#666666',
  foregroundColor: '#000000',
  textColorOnForeground: '#ffffff',
  enableReset: false,
  botConvoTitle: 'Botpress Webchat'
}

export default class Web extends React.Component {
  constructor(props) {
    super(props)

    const { options } = queryString.parse(location.search)
    const { hideWidget, config } = JSON.parse(decodeURIComponent(options || '{}'))

    this.state = {
      view: null,
      textToSend: '',
      loading: true,
      played: false,
      opened: false,
      config: Object.assign({}, defaultOptions, config),
      conversations: [],
      currentConversation: null,
      currentConversationId: null,
      unreadCount: 0,
      isButtonHidden: hideWidget
    }
  }

  componentWillMount() {
    this.setupSocket()
  }

  componentDidMount() {
    this.setUserId()
      .then(::this.fetchData)
      .then(() => {
        this.handleSwitchView('widget')
        if (!this.state.isButtonHidden) this.showConvoPopUp()

        this.setState({ loading: false })
      })

    window.addEventListener('message', this.handleIframeApi)

    this.props.bp.axios.interceptors.request.use(
      config => {
        if (/\/api\/botpress-platform-webchat\//i.test(config.url)) {
          const prefix = config.url.indexOf('?') > 0 ? '&' : '?'
          config.url += prefix + '__ts=' + new Date().getTime()
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleIframeApi)
    this.isUnmounted = true
  }

  handleIframeApi = ({ data: { action, payload } }) => {
    if (action === 'configure') {
      this.setState({ config: Object.assign({}, defaultOptions, payload) })
    } else if (action === 'event') {
      const { type, text } = payload
      if (type === 'show') {
        this.handleSwitchView('side')
      } else if (type === 'hide') {
        this.handleSwitchView('widget')
      } else if (type === 'message') {
        this.setState({ textToSend: text })
        this.handleSendMessage()
      } else {
        const userId = window.__BP_VISITOR_ID
        const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/events/${userId}`
        return this.props.bp.axios.post(url, { type, payload })
      }
    }
  }

  setUserId() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (window.__BP_VISITOR_ID) {
          clearInterval(interval)
          this.userId = window.__BP_VISITOR_ID
          resolve()
        }
      }, 250)

      setTimeout(() => {
        clearInterval(interval)
        reject()
      }, 300000)
    })
  }

  showConvoPopUp() {
    if (this.state.config.welcomeMsgEnable) {
      setTimeout(() => {
        if (!this.state.opened) {
          this.handleSwitchView('convo')
        }
      }, this.state.config.welcomeMsgDelay || 5000)
    }
  }

  handleSwitchView(view) {
    if (view === 'side' && this.state.view !== 'side') {
      this.setState({
        opened: true,
        unreadCount: 0,
        convoTransition: 'fadeOut',
        widgetTransition: 'fadeOut'
      })

      setTimeout(() => {
        this.setState({
          sideTransition: 'fadeIn',
          view: view
        })
      }, ANIM_DURATION + 10)
    }

    if (view === 'convo') {
      setTimeout(() => {
        this.setState({
          convoTransition: 'fadeIn',
          view: view
        })
      }, ANIM_DURATION)
    }

    if (view === 'widget') {
      this.setState({
        convoTransition: 'fadeOut',
        sideTransition: 'fadeOut'
      })

      if (!this.state.view || this.state.view === 'side') {
        setTimeout(() => {
          this.setState({
            widgetTransition: 'fadeIn',
            view: view
          })
        }, ANIM_DURATION)
      }
    }

    setTimeout(() => {
      this.setState({
        view: view
      })
    }, ANIM_DURATION)

    setTimeout(() => {
      this.setState({
        widgetTransition: null,
        convoTransition: null,
        sideTransition: this.state.sideTransition === 'fadeIn' ? 'fadeIn' : null
      })
    }, ANIM_DURATION * 2.1)
  }

  handleButtonClicked() {
    if (this.state.view === 'convo') {
      this.handleSwitchView('widget')
    } else {
      this.handleSwitchView('side')
    }
  }

  setupSocket() {
    // Connect the Botpress's Web Socket to the server
    if (this.props.bp && this.props.bp.events) {
      this.props.bp.events.setup()
    }

    this.props.bp.events.on('guest.webchat.message', ::this.handleNewMessage)
    this.props.bp.events.on('guest.webchat.typing', ::this.handleBotTyping)
  }

  fetchData() {
    return this.fetchConversations().then(::this.fetchCurrentConversation)
  }

  fetchConversations() {
    const axios = this.props.bp.axios
    const userId = this.userId
    const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/conversations/${userId}`

    return axios.get(url).then(({ data }) => new Promise(resolve => !this.isUnmounted && this.setState({ conversations: data }, resolve)))
  }

  fetchCurrentConversation(convoId) {
    const axios = this.props.bp.axios
    const userId = this.userId

    let conversationIdToFetch = convoId || this.state.currentConversationId
    if (this.state.conversations.length > 0 && !conversationIdToFetch) {
      conversationIdToFetch = this.state.conversations[0].id
      this.setState({ currentConversationId: conversationIdToFetch })
    }

    const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/conversations/${userId}/${conversationIdToFetch}`

    return axios.get(url).then(({ data }) => {
      // Possible race condition if the current conversation changed while fetching
      if (this.state.currentConversationId !== conversationIdToFetch) {
        // In which case we simply restart fetching
        return fetchCurrentConversation()
      }

      this.setState({ currentConversation: data })
    })
  }

  handleNewMessage(event) {
    this.safeUpdateCurrentConvo(event.conversationId, true, convo => {
      return Object.assign({}, convo, {
        messages: [...convo.messages, event],
        typingUntil: event.userId ? convo.typingUntil : null
      })
    })
  }

  handleBotTyping(event) {
    this.safeUpdateCurrentConvo(event.conversationId, false, convo => {
      return Object.assign({}, convo, {
        typingUntil: addMilliseconds(new Date(), event.timeInMs)
      })
    })

    setTimeout(::this.expireTyping, event.timeInMs + 50)
  }

  expireTyping() {
    const currentTypingUntil = this.state.currentConversation && this.state.currentConversation.typingUntil

    const timerExpired = currentTypingUntil && isBefore(new Date(currentTypingUntil), new Date())
    if (timerExpired) {
      this.safeUpdateCurrentConvo(this.state.currentConversationId, false, convo => {
        return Object.assign({}, convo, { typingUntil: null })
      })
    }
  }

  safeUpdateCurrentConvo(convoId, addToUnread, updater) {
    // there's no conversation to update or our convo changed
    if (!this.state.currentConversation || this.state.currentConversationId !== convoId) {
      this.fetchConversations().then(::this.fetchCurrentConversation)

      return
    }

    // there's no focus on the actual conversation
    if ((document.hasFocus && !document.hasFocus()) || this.state.view !== 'side') {
      this.playSound()

      if (addToUnread) {
        this.increaseUnreadCount()
      }
    }

    this.handleResetUnreadCount()

    const newConvo = updater && updater(this.state.currentConversation)

    if (newConvo) {
      this.setState({ currentConversation: newConvo })
    }
  }

  playSound() {
    if (!this.state.played && this.state.view !== 'convo') {
      // TODO: Remove this condition (view !== 'convo') and fix transition sounds
      const audio = new Audio('/api/botpress-platform-webchat/static/notification.mp3')
      audio.play()

      this.setState({
        played: true
      })

      setTimeout(() => {
        this.setState({
          played: false
        })
      }, MIN_TIME_BETWEEN_SOUNDS)
    }
  }

  increaseUnreadCount() {
    this.setState({
      unreadCount: this.state.unreadCount + 1
    })
  }

  handleResetUnreadCount() {
    if (document.hasFocus && document.hasFocus() && this.state.view === 'side') {
      this.setState({
        unreadCount: 0
      })
    }
  }

  handleSendMessage() {
    const userId = window.__BP_VISITOR_ID
    const config = { params: { conversationId: this.state.currentConversationId } }

    return this.handleSendData({ type: 'text', text: this.state.textToSend }).then(() => {
      this.handleSwitchView('side')
      this.setState({ textToSend: '' })
    })
  }

  handleTextChanged(event) {
    this.setState({
      textToSend: event.target.value
    })
  }

  handleAddEmoji(emoji, event) {
    this.setState({
      textToSend: this.state.textToSend + emoji.native + ' '
    })
  }

  handleSendQuickReply(title, payload) {
    return this.handleSendData({
      type: 'quick_reply',
      text: title,
      data: { payload }
    })
  }

  handleSendForm(fields, formId, repr) {
    return this.handleSendData({
      type: 'form',
      formId: formId,
      text: repr,
      data: fields
    })
  }

  handleLoginPrompt(username, password) {
    return this.handleSendData({
      type: 'login_prompt',
      text: 'Provided login information',
      data: { username, password }
    })
  }

  handleFileUploadSend(title, payload, file) {
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/messages/${userId}/files`
    const config = { params: { conversationId: this.state.currentConversationId } }

    let data = new FormData()
    data.append('file', file)

    return this.props.bp.axios.post(url, data, config).then()
  }

  handleSendData(data) {
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/messages/${userId}`
    const config = { params: { conversationId: this.state.currentConversationId } }
    return this.props.bp.axios.post(url, data, config).then()
  }

  handleSwitchConvo(convoId) {
    this.setState({
      currentConversation: null,
      currentConversationId: convoId
    })

    this.fetchCurrentConversation(convoId)
  }

  handleClosePanel() {
    this.handleSwitchView('widget')
  }

  handleSessionReset() {
    const userId = window.__BP_VISITOR_ID
    const url = `${BOT_HOSTNAME}/api/botpress-platform-webchat/conversations/${userId}/${this.state
      .currentConversationId}/reset`
    return this.props.bp.axios.post(url).then()
  }

  renderOpenIcon() {
    return (
      <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path fill="#FFF" d="M10.6,3.2c0.1-0.1,0.1-0.2,0.1-0.4C10.8,2.4,10.4,2,10,2C9.6,2,9.2,2.4,9.2,2.8c0,0.1,0,0.3,0.1,0.4c0.1,0.1,0,0.3-0.1,0.3
          C9.1,3.6,9,3.5,8.9,3.4C8.8,3.2,8.8,3,8.8,2.8c0-0.7,0.6-1.2,1.2-1.2c0.7,0,1.2,0.6,1.2,1.2c0,0.2-0.1,0.4-0.2,0.6
          c0,0.1-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0C10.6,3.4,10.6,3.3,10.6,3.2z M8.4,4c0.1-0.1,0.2-0.2,0.1-0.3C8.3,3.4,8.2,3.1,8.2,2.8
          C8.2,1.8,9,1,10,1s1.8,0.8,1.8,1.8c0,0.3-0.1,0.6-0.2,0.9c-0.1,0.1,0,0.3,0.1,0.3c0,0,0.1,0,0.1,0c0.1,0,0.2,0,0.2-0.1
          c0.2-0.3,0.3-0.7,0.3-1.1c0-1.3-1-2.3-2.3-2.3s-2.3,1-2.3,2.3c0,0.4,0.1,0.8,0.3,1.1C8.1,4,8.2,4.1,8.4,4z M17.9,7.1v7
          c0,1.2-0.9,2.1-2.1,2.1h-1L12,19.4c0,0.1-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.2-0.1-0.2-0.2v-3.1H4.2c-1.2,0-2.1-0.9-2.1-2.1
          v-7C2.1,5.9,3,5,4.2,5h5.6V3.3C9.8,3.2,9.9,3,10,3c0.1,0,0.2,0.1,0.2,0.2V5h5.6C17,5,17.9,5.9,17.9,7.1z M7.4,10.7c0-0.6-0.5-1-1-1
          c-0.6,0-1,0.5-1,1c0,0.6,0.5,1,1,1C6.9,11.7,7.4,11.2,7.4,10.7z M14.7,10.7c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1c0,0.6,0.5,1,1,1
          C14.2,11.7,14.7,11.2,14.7,10.7z"/>
        <path className={style.blink} fill="#FFF" d="M10.6,3.2c0.1-0.1,0.1-0.2,0.1-0.4C10.8,2.4,10.4,2,10,2C9.6,2,9.2,2.4,9.2,2.8c0,0.1,0,0.3,0.1,0.4c0.1,0.1,0,0.3-0.1,0.3
          C9.1,3.6,9,3.5,8.9,3.4C8.8,3.2,8.8,3,8.8,2.8c0-0.7,0.6-1.2,1.2-1.2c0.7,0,1.2,0.6,1.2,1.2c0,0.2-0.1,0.4-0.2,0.6
          c0,0.1-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0C10.6,3.4,10.6,3.3,10.6,3.2z M8.4,4c0.1-0.1,0.2-0.2,0.1-0.3C8.3,3.4,8.2,3.1,8.2,2.8
          C8.2,1.8,9,1,10,1s1.8,0.8,1.8,1.8c0,0.3-0.1,0.6-0.2,0.9c-0.1,0.1,0,0.3,0.1,0.3c0,0,0.1,0,0.1,0c0.1,0,0.2,0,0.2-0.1
          c0.2-0.3,0.3-0.7,0.3-1.1c0-1.3-1-2.3-2.3-2.3s-2.3,1-2.3,2.3c0,0.4,0.1,0.8,0.3,1.1C8.1,4,8.2,4.1,8.4,4z M17.9,7.1v7
          c0,1.2-0.9,2.1-2.1,2.1h-1L12,19.4c0,0.1-0.1,0.1-0.2,0.1c0,0-0.1,0-0.1,0c-0.1,0-0.2-0.1-0.2-0.2v-3.1H4.2c-1.2,0-2.1-0.9-2.1-2.1
          v-7C2.1,5.9,3,5,4.2,5h5.6V3.3C9.8,3.2,9.9,3,10,3c0.1,0,0.2,0.1,0.2,0.2V5h5.6C17,5,17.9,5.9,17.9,7.1z M7.4,10.7c0-0.6-0.5-1-1-1
          c-0.6,0-1,0.5-1,1c0,0.6,0.5,1,1,1C6.9,11.7,7.4,11.2,7.4,10.7z M14.7,10.7c0-0.6-0.5-1-1-1c-0.6,0-1,0.5-1,1c0,0.6,0.5,1,1,1
          C14.2,11.7,14.7,11.2,14.7,10.7z"/>
      </svg>
    )
  }

  renderCloseIcon() {
    return (
      <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16.726 15.402c.365.366.365.96 0 1.324-.178.178-.416.274-.663.274-.246 0-.484-.096-.663-.274L8.323 9.648h.353L1.6 16.726c-.177.178-.416.274-.663.274-.246 0-.484-.096-.663-.274-.365-.365-.365-.958 0-1.324L7.35 8.324v.35L.275 1.6C-.09 1.233-.09.64.274.274c.367-.365.96-.365 1.326 0l7.076 7.078h-.353L15.4.274c.366-.365.96-.365 1.326 0 .365.366.365.958 0 1.324L9.65 8.675v-.35l7.076 7.077z"
          fill="#FFF"
          fillRule="evenodd"
        />
      </svg>
    )
  }

  renderUncountMessages() {
    return <span className={style.unread}>{this.state.unreadCount}</span>
  }

  renderButton() {
    if (this.state.isButtonHidden) return null
    return (
      <button
        className={style[this.state.widgetTransition]}
        onClick={::this.handleButtonClicked}
        style={{ backgroundColor: this.state.config.foregroundColor }}
      >
        <i>{this.state.view === 'convo' ? this.renderCloseIcon() : this.renderOpenIcon()}</i>
        {this.state.unreadCount > 0 ? this.renderUncountMessages() : null}
      </button>
    )
  }

  renderWidget() {
    return (
      <div className={classnames(style['container'])}>
        <div className={classnames(style['widget-container'])}>
          <span>
            {this.state.view === 'convo' ? (
              <Convo
                transition={this.state.convoTransition}
                change={::this.handleTextChanged}
                send={::this.handleSendMessage}
                config={this.state.config}
                text={this.state.textToSend}
              />
            ) : null}
            {this.renderButton()}
          </span>
        </div>
      </div>
    )
  }

  renderSide() {
    return (
      <Side
        config={this.state.config}
        text={this.state.textToSend}
        fullscreen={this.props.fullscreen}
        transition={!this.props.fullscreen ? this.state.sideTransition : null}
        unreadCount={this.state.unreadCount}
        currentConversation={this.state.currentConversation}
        conversations={this.state.conversations}
        addEmojiToText={::this.handleAddEmoji}
        onClose={!this.props.fullscreen ? ::this.handleClosePanel : null}
        onResetSession={::this.handleSessionReset}
        onSwitchConvo={::this.handleSwitchConvo}
        onTextSend={::this.handleSendMessage}
        onTextChanged={::this.handleTextChanged}
        onQuickReplySend={::this.handleSendQuickReply}
        onFormSend={::this.handleSendForm}
        onFileUploadSend={::this.handleFileUploadSend}
        onLoginPromptSend={::this.handleLoginPrompt}
        onSendData={::this.handleSendData}
      />
    )
  }

  render() {
    if (this.state.loading || !this.state.view) {
      return null
    }

    window.parent &&
      window.parent.postMessage({ type: 'setClass', value: 'bp-widget-web bp-widget-' + this.state.view }, '*')

    const view = this.state.view !== 'side' && !this.props.fullscreen ? this.renderWidget() : this.renderSide()

    return (
      <div className={style.web} onFocus={::this.handleResetUnreadCount}>
        {view}
      </div>
    )
  }
}

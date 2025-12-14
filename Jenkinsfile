pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/sh", "-c", "sleep 3600"]
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker/config.json
      subPath: .dockerconfigjson
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: kubectl
    image: alpine/k8s:1.29.4
    command: ["cat"]
    tty: true
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  volumes:
  - name: docker-config
    secret:
      secretName: dockerhub-secret
  - name: workspace-volume
    emptyDir: {}
"""
    }
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'develop', url: 'https://github.com/JimWhere/JimWhere-Vue.git'
      }
    }

    stage('Install & Build') {
      steps {
        container('node') {
          sh '''
            npm ci
            npm run build
          '''
        }
      }
    }

    stage('Docker Build & Push') {
      steps {
        container('kaniko') {
          sh '''
            /kaniko/executor \
              --context=dir:///home/jenkins/agent/workspace/jimwhere-frontend-ci-cd \
              --dockerfile=Dockerfile \
              --destination=docker.io/kimsangjaedocker/jimwhere-front:latest
          '''
        }
      }
    }

    stage('Rollout Restart (Frontend)') {
      steps {
        container('kubectl') {
          sh '''
            kubectl rollout restart deployment jimwhere-frontend -n jimwhere
            kubectl rollout status deployment jimwhere-frontend -n jimwhere
          '''
        }
      }
    }
  }
}
